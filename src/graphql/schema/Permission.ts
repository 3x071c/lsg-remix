import { extendType, objectType, nonNull, intArg } from "nexus";

export const Permission = objectType({
	definition: (t) => {
		t.int("id");
		t.string("name");
		t.list.field("users", {
			resolve: ({ id }, _args, ctx) =>
				ctx.prisma.permission
					.findUnique({ where: { id: id! } })
					.users(),
			type: "PermissionsOnUsers",
		});
	},
	description:
		"The Permission model is assigned to a user to grant him a role/permission in the cms",
	name: "Permission",
});

export const PermissionQuery = extendType({
	definition(t) {
		t.field("permission", {
			args: {
				id: nonNull(intArg()),
			},
			resolve: (_root, { id }, ctx) =>
				ctx.prisma.permission.findUnique({ where: { id } }),
			type: "Permission",
		});
		t.list.field("permissions", {
			resolve: (_root, _args, ctx) => ctx.prisma.permission.findMany(),
			type: "Permission",
		});
	},
	type: "Query",
});
