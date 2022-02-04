import { intArg, nonNull, objectType, queryField } from "nexus";

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
	resolve: (_root, _args, ctx) => ctx.prisma.page.findMany(),
	type: "Page",
});
