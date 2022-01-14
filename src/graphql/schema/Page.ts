import { extendType, nonNull, objectType, stringArg, booleanArg } from "nexus";

export const Page = objectType({
	definition(t) {
		t.boolean("isHero");
		t.string("title");
		t.string("content");
		t.list.field("children", {
			type: Page,
		});
	},
	name: "Page",
});

export const PageQuery = extendType({
	definition(t) {
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
				isHero: booleanArg(),
				title: nonNull(stringArg()),
			},
			resolve: (_root, { content, isHero, title }, ctx) =>
				ctx.prisma.page.create({
					data: {
						content,
						isHero: isHero || false,
						title,
					},
				}),
			type: "Page",
		});
	},
	type: "Mutation",
});
