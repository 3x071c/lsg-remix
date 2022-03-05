import { objectType } from "nexus";

export const CanMutateUsersOnUsers = objectType({
	definition: (t) => {
		t.field("parent", {
			resolve: ({ childId, parentId }, _args, ctx) =>
				ctx.prisma.canMutateUsersOnUsers
					.findUnique({
						where: {
							parentId_childId: {
								childId,
								parentId,
							},
						},
					})
					.parent(),
			type: "User",
		});
		t.int("parentId");
		t.field("child", {
			resolve: ({ childId, parentId }, _args, ctx) =>
				ctx.prisma.canMutateUsersOnUsers
					.findUnique({
						where: {
							parentId_childId: {
								childId,
								parentId,
							},
						},
					})
					.child(),
			type: "User",
		});
		t.int("childId");
		t.field("createdBy", {
			resolve: ({ childId, parentId }, _args, ctx) =>
				ctx.prisma.canMutateUsersOnUsers
					.findUnique({
						where: {
							parentId_childId: {
								childId,
								parentId,
							},
						},
					})
					.createdBy(),
			type: "User",
		});
		t.int("createdById");
		t.date("createdAt");
	},
	name: "CanMutateUsersOnUsers",
});
