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
	authorize: async (_root, _args, ctx) =>
		(
			await ctx.prisma.user.findUnique({
				where: {
					id: ctx.req.session.user?.id ?? 0,
				},
			})
		)?.canMutatePagesSubscription ?? false,
	resolve: async (_root, { content, parentId, path, title }, ctx) => {
		const createdPage = await ctx.prisma.page.create({
			data: {
				content,
				parentId,
				path,
				title,
				users: {
					create: {
						userId: ctx.req.session.user!.id,
					},
				},
			},
		});

		await prisma?.$transaction([
			...(
				await ctx.prisma.user.findMany({
					where: {
						canMutatePagesSubscription: true,
					},
				})
			).map(({ id: userId }) => {
				return ctx.prisma.user.update({
					data: {
						canMutatePages: {
							connectOrCreate: {
								create: {
									createdById: ctx.req.session.user!.id,
									pageId: createdPage.id,
								},
								where: {
									userId_pageId: {
										pageId: createdPage.id,
										userId,
									},
								},
							},
						},
					},
					where: {
						id: userId,
					},
				});
			}),
		]);

		return createdPage;
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
	authorize: async (_root, { id }, ctx) =>
		!!(await ctx.prisma.page.findFirst({
			where: {
				canBeMutatedBy: {
					some: {
						user: {
							id: ctx.req.session.user?.id ?? 0,
						},
					},
				},
				id,
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
				canBeMutatedBy: {
					some: {
						user: {
							id: ctx.req.session.user?.id ?? 0,
						},
					},
				},
				id,
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
