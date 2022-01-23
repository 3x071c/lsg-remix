import { objectType } from "nexus";

export const PagesOnUsers = objectType({
	definition: (t) => {
		t.date("assignedAt");
		t.field("user", {
			resolve: ({ userId, pageId }, _args, ctx) =>
				ctx.prisma.pagesOnUsers
					.findUnique({
						where: {
							userId_pageId: {
								pageId: pageId!,
								userId: userId!,
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
								pageId: pageId!,
								userId: userId!,
							},
						},
					})
					.page(),
			type: "Page",
		});
		t.int("pageId");
	},
	description:
		"This is a joint model, connecting the Permission and User model to form a many-to-many relation. It contains information about when the page was linked to the user.",
	name: "PagesOnUsers",
});
