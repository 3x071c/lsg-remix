import { objectType } from "nexus";

export const CanMutatePagesOnUsers = objectType({
	definition: (t) => {
		t.field("user", {
			resolve: ({ userId, pageId }, _args, ctx) =>
				ctx.prisma.canMutatePagesOnUsers
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
				ctx.prisma.canMutatePagesOnUsers
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
		t.field("createdBy", {
			resolve: ({ userId, pageId }, _args, ctx) =>
				ctx.prisma.canMutatePagesOnUsers
					.findUnique({
						where: {
							userId_pageId: {
								pageId,
								userId,
							},
						},
					})
					.createdBy(),
			type: "User",
		});
		t.int("createdById");
		t.date("createdAt");
	},
	name: "CanMutatePagesOnUsers",
});
