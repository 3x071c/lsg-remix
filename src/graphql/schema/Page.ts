import { extendType, intArg, nonNull, objectType, stringArg } from "nexus";

export const Page = objectType({
	definition: (t) => {
		t.int("id");
		t.string("title");
		t.string("content");
		t.date("lastEdited");
		t.list.field("history", {
			resolve: ({ id }, _args, ctx) =>
				ctx.prisma.page.findUnique({ where: { id: id! } }).history(),
			type: "PageHistory",
		});
		t.list.field("authors", {
			resolve: ({ id }, _args, ctx) =>
				ctx.prisma.page.findUnique({ where: { id: id! } }).authors(),
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
	},
	description:
		"The page model represents a webpage which may be edited in the cms",
	name: "Page",
});

export const PageQuery = extendType({
	definition(t) {
		t.field("page", {
			args: {
				id: nonNull(intArg()),
			},
			resolve: (_root, { id }, ctx) =>
				ctx.prisma.page.findUnique({ where: { id } }),
			type: "Page",
		});
		t.list.field("pages", {
			resolve: (_root, _args, ctx) => ctx.prisma.page.findMany(),
			type: "Page",
		});
	},
	type: "Query",
});

export const PageMutation = extendType({
	definition(t) {
		t.field("createPage", {
			args: {
				content: nonNull(stringArg()),
				title: nonNull(stringArg()),
			},
			resolve: (_root, { content, title }, ctx) =>
				ctx.prisma.page.create({
					data: {
						content,
						title,
					},
				}),
			type: "Page",
		});
	},
	type: "Mutation",
});
