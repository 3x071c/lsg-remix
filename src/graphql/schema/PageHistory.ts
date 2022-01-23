import { objectType } from "nexus";

export const PageHistory = objectType({
	definition: (t) => {
		t.int("id");
		t.string("title");
		t.string("content");
		t.date("lastEdited");
		t.field("page", {
			resolve: ({ id }, _args, ctx) =>
				ctx.prisma.pageHistory
					.findUnique({ where: { id: id! } })
					.page(),
			type: "Page",
		});
		t.int("pageId");
	},
	description:
		"The PageHistory model contains an archive of previous versions of page models",
	name: "PageHistory",
});
