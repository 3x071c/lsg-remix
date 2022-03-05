import { objectType } from "nexus";

export const PagesOnUsers = objectType({
	definition: (t) => {
		t.field("user", {
			resolve: ({ userId, pageId }, _args, ctx) =>
				ctx.prisma.pagesOnUsers
					.findUnique({
						where: {
							userId_pageId: {
								pageId,
								userId,
							},
						},
					})
					.user(),
			type: "User",
		});
		t.int("userId");
		t.field("page", {
			resolve: ({ userId, pageId }, _args, ctx) =>
				ctx.prisma.pagesOnUsers
					.findUnique({
						where: {
							userId_pageId: {
								pageId,
								userId,
							},
						},
					})
					.page(),
			type: "Page",
		});
		t.int("pageId");
		t.date("createdAt");
	},
	name: "PagesOnUsers",
});
