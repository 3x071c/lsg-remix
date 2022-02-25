import type { UserWithPermissions } from "$types/auth";
import {
	intArg,
	mutationField,
	nonNull,
	objectType,
	queryField,
	stringArg,
} from "nexus";
import { canMutatePage, getAuthenticatedUserWithPermissions } from "$lib/auth";
import { undefinedOrValue } from "$lib/prisma";

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
		const user: UserWithPermissions | null =
			await getAuthenticatedUserWithPermissions(ctx);

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
export const EditPageMutation = mutationField("editPage", {
	args: {
		content: stringArg(),
		id: nonNull(intArg()),
		parentId: intArg(),
		path: stringArg(),
		title: stringArg(),
	},
	authorize: async (_root, { id }, ctx) => {
		const authorized = await canMutatePage(id, ctx);
		return authorized;
	},
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
			include: {
				users: true,
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
	authorize: (_root, { id }, ctx) => {
		return canMutatePage(id, ctx);
	},
	resolve: async (_root, { id }, ctx) => {
		const deletePage = ctx.prisma.page.delete({
			where: {
				id,
			},
		});

		// delete all canMutatePagesOnUsers entries with this pageId
		const deletePagePermissions =
			ctx.prisma.canMutatePagesOnUsers.deleteMany({
				where: {
					pageId: id,
				},
			});

		// delete all pagesOnUsers entries
		const deletePageOnUser = ctx.prisma.pagesOnUsers.deleteMany({
			where: {
				pageId: id,
			},
		});

		const transaction = await ctx.prisma.$transaction([
			deletePagePermissions,
			deletePageOnUser,
			deletePage,
		]);

		return transaction[2];
	},
	type: "Page",
});
