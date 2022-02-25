import type { Context } from "../context";
import type { CanMutatePagesOnUsers } from "@prisma/client";
import {
	intArg,
	mutationField,
	nonNull,
	objectType,
	queryField,
	stringArg,
} from "nexus";
import { undefinedOrValue } from "$lib/util";

export const Page = objectType({
	definition: (t) => {
		t.int("id");
		t.string("path");
		t.string("title");
		t.string("content");
		t.list.field("users", {
			resolve: ({ id }, _args, ctx) =>
				ctx.prisma.page.findUnique({ where: { id: id! } }).users(),
			type: "PagesOnUsers",
		});
		t.field("parent", {
			resolve: ({ id }, _args, ctx) =>
				ctx.prisma.page.findUnique({ where: { id: id! } }).parent(),
			type: "Page",
		});
		t.int("parentId");
		t.list.field("children", {
			resolve: ({ id }, _args, ctx) =>
				ctx.prisma.page.findUnique({ where: { id: id! } }).children(),
			type: "Page",
		});
		t.list.field("canBeMutatedBy", {
			resolve: ({ id }, _args, ctx) =>
				ctx.prisma.page
					.findUnique({ where: { id: id! } })
					.canBeMutatedBy(),
			type: "CanMutatePagesOnUsers",
		});
		t.date("lastMutatedAt");
		t.date("createdAt");
	},
	name: "Page",
});

export const PageQuery = queryField("page", {
	args: {
		id: nonNull(intArg()),
	},
	resolve: (_root, { id }, ctx) =>
		ctx.prisma.page.findUnique({ where: { id } }),
	type: "Page",
});
export const PagesQuery = queryField("pages", {
	list: true,
	resolve: (_root, _args, ctx) => ctx.prisma.page.findMany(),
	type: "Page",
});

export const CreatePageMutation = mutationField("createPage", {
	args: {
		content: nonNull(stringArg()),
		parentId: intArg(),
		path: nonNull(stringArg()),
		title: nonNull(stringArg()),
	},
	authorize: async (_root, _args, ctx) => {
		if (!ctx.req.session.user) return false;

		const user = await ctx.prisma.user.findUnique({
			where: { id: ctx.req.session.user.id },
		});

		return !!user?.canMutatePagesSubscription;
	},
	resolve: (_root, { content, parentId, path, title }, ctx) => {
		return ctx.prisma.page.create({
			data: {
				/* give the user who created the page the permission
		 		to edit the page */
				canBeMutatedBy: {
					create: [
						{
							createdById: ctx.req.session.user!.id,
							userId: ctx.req.session.user!.id,
						},
					],
				},
				content,
				parentId,
				path,
				title,
				users: {
					create: [
						{
							userId: ctx.req.session.user!.id,
						},
					],
				},
			},
		});
	},
	type: "Page",
});

export const canMutatePage = async (
	pageId: number,
	ctx: Context,
): Promise<boolean> => {
	if (ctx.req.session.user == null) return false;

	const user = await ctx.prisma.user.findUnique({
		include: {
			canMutatePages: true,
		},
		where: {
			id: ctx.req.session.user.id,
		},
	});

	if (!user) return false;

	return (
		user.canMutatePages.filter(
			(p: CanMutatePagesOnUsers) => p.pageId === pageId,
		).length > 0
	);
};

export const EditPageMutation = mutationField("editPage", {
	args: {
		content: stringArg(),
		id: nonNull(intArg()),
		parentId: intArg(),
		path: stringArg(),
		title: stringArg(),
	},
	authorize: async (_root, { id }, ctx) =>
		!!(await ctx.prisma.page.findFirst({
			where: {
				id,
				canBeMutatedBy: {
					some: {
						user: {
							id: ctx.req.session.user?.id ?? 0,
						},
					},
				},
			},
		})),
	resolve: (_root, { content, id, parentId, path, title }, ctx) => {
		return ctx.prisma.page.update({
			data: {
				content: undefinedOrValue(content),
				parentId: undefinedOrValue(parentId),
				path: undefinedOrValue(path),
				title: undefinedOrValue(title),
				/*
				If the user has not yet edited this page, create a new
				PagesOnUsers entry
				*/
				users: {
					upsert: {
						create: {
							userId: ctx.req.session.user!.id,
						},
						update: {},
						where: {
							userId_pageId: {
								pageId: id,
								userId: ctx.req.session.user!.id,
							},
						},
					},
				},
			},
			where: {
				id,
			},
		});
	},
	type: "Page",
});
export const DeletePageMutation = mutationField("deletePage", {
	args: {
		id: nonNull(intArg()),
	},
	authorize: async (_root, { id }, ctx) =>
		!!(await ctx.prisma.page.findFirst({
			where: {
				id,
				canBeMutatedBy: {
					some: {
						user: {
							id: ctx.req.session.user?.id ?? 0,
						},
					},
				},
			},
		})),
	resolve: async (_root, { id }, ctx) =>
		(
			await ctx.prisma.$transaction([
				ctx.prisma.canMutatePagesOnUsers.deleteMany({
					where: {
						pageId: id,
					},
				}),
				ctx.prisma.pagesOnUsers.deleteMany({
					where: {
						pageId: id,
					},
				}),
				ctx.prisma.page.delete({
					where: {
						id,
					},
				}),
			])
		)[2],
	type: "Page",
});
