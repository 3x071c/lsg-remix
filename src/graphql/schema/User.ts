import { extendType, objectType, nonNull, intArg } from "nexus";

export const User = objectType({
	definition: (t) => {
		t.int("id");
		t.string("name");
		t.string("short");
		t.list.field("pages", {
			resolve: ({ id }, _args, ctx) =>
				ctx.prisma.user.findUnique({ where: { id } }).pages(),
			type: "PagesOnUsers",
		});
		t.list.field("permissions", {
			resolve: ({ id }, _args, ctx) =>
				ctx.prisma.user.findUnique({ where: { id } }).permissions(),
			type: "PermissionsOnUsers",
		});
		t.list.field("permissionsAssigned", {
			resolve: ({ id }, _args, ctx) =>
				ctx.prisma.user
					.findUnique({ where: { id } })
					.permissionsAssigned(),
			type: "PermissionsOnUsers",
		});
	},
	description:
		"The user model contains information about an authorized CMS user account",
	name: "User",
});

export const UserQuery = extendType({
	definition(t) {
		t.field("user", {
			args: {
				id: nonNull(intArg()),
			},
			resolve: (_root, { id }, ctx) =>
				ctx.prisma.user.findUnique({ where: { id } }),
			type: "User",
		});
		t.list.field("users", {
			resolve: (_root, _args, ctx) => ctx.prisma.user.findMany(),
			type: "User",
		});
	},
	type: "Query",
});

// TODO implement auth
