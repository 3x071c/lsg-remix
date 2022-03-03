import {
	intArg,
	mutationField,
	nonNull,
	objectType,
	queryField,
	stringArg,
} from "nexus";

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
		!!ctx.req.session.user &&
		!!(
			await ctx.prisma.user.findUnique({
				where: {
					id: ctx.req.session.user.id,
				},
			})
		)?.canMutatePagesSubscription,
	resolve: async (_root, args, ctx) => {
		const createdPage = await ctx.prisma.page.create({
			data: {
				...args,
				users: {
					create: {
						userId: ctx.req.session.user!.id,
					},
				},
			},
		});

		await ctx.prisma.$transaction([
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
									createdById: userId,
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
		!!ctx.req.session.user &&
		!!(await ctx.prisma.canMutatePagesOnUsers.findUnique({
			where: {
				userId_pageId: {
					pageId: id,
					userId: ctx.req.session.user.id,
				},
			},
		})),
	resolve: (_root, { parentId, id, ...args }, ctx) =>
		ctx.prisma.page.update({
			data: {
				...Object.fromEntries(
					Object.entries(args).filter(([, v]) => v !== null),
				),
				parentId /* Is nullable in the schema */,
				users: {
					connectOrCreate: {
						create: {
							userId: ctx.req.session.user!.id,
						},
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
		}),
	type: "Page",
});
export const DeletePageMutation = mutationField("deletePage", {
	args: {
		id: nonNull(intArg()),
	},
	authorize: async (_root, { id }, ctx) =>
		!!ctx.req.session.user &&
		!!(await ctx.prisma.canMutatePagesOnUsers.findUnique({
			where: {
				userId_pageId: {
					pageId: id,
					userId: ctx.req.session.user.id,
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
