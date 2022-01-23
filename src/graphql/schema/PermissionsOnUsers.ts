import { objectType } from "nexus";

export const PermissionsOnUsers = objectType({
	definition: (t) => {
		t.date("assignedAt");
		t.field("assignedBy", {
			resolve: ({ userId, permissionId }, _args, ctx) =>
				ctx.prisma.permissionsOnUsers
					.findUnique({
						where: {
							userId_permissionId: {
								permissionId: permissionId!,
								userId: userId!,
							},
						},
					})
					.assignedBy(),
			type: "User",
		});
		t.int("assignedById");
		t.field("user", {
			resolve: ({ userId, permissionId }, _args, ctx) =>
				ctx.prisma.permissionsOnUsers
					.findUnique({
						where: {
							userId_permissionId: {
								permissionId: permissionId!,
								userId: userId!,
							},
						},
					})
					.user(),
			type: "User",
		});
		t.int("userId");
		t.field("permission", {
			resolve: ({ userId, permissionId }, _args, ctx) =>
				ctx.prisma.permissionsOnUsers
					.findUnique({
						where: {
							userId_permissionId: {
								permissionId: permissionId!,
								userId: userId!,
							},
						},
					})
					.permission(),
			type: "Permission",
		});
		t.int("permissionId");
	},
	description:
		"This is a joint model, connecting the Permission and User model to form a many-to-many relation. It contains information about who assigned the permission to the user.",
	name: "PermissionsOnUsers",
});
