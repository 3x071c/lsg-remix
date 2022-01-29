import * as argon2 from "argon2";
import {
	extendType,
	objectType,
	nonNull,
	intArg,
	mutationField,
	stringArg,
} from "nexus";

export const User = objectType({
	definition: (t) => {
		t.int("id");
		t.string("name");
		t.string("short");
		t.list.field("pages", {
			resolve: ({ id }, _args, ctx) =>
				ctx.prisma.user.findUnique({ where: { id: id! } }).pages(),
			type: "PagesOnUsers",
		});
		t.list.field("permissions", {
			resolve: ({ id }, _args, ctx) =>
				ctx.prisma.user
					.findUnique({ where: { id: id! } })
					.permissions(),
			type: "PermissionsOnUsers",
		});
		t.list.field("permissionsAssigned", {
			resolve: ({ id }, _args, ctx) =>
				ctx.prisma.user
					.findUnique({ where: { id: id! } })
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
			authorize: (_root, _args, ctx) => {
				const map = ctx.req.session.user!.permissions!.map(
					(permOnUsers) => permOnUsers.permission.name,
				);
				// only if a user can mutate all users he should be able
				// to read all users
				return map.includes("canMutateUsers");
			},
			resolve: (_root, _args, ctx) => ctx.prisma.user.findMany(),
			type: "User",
		});
	},
	type: "Query",
});

export const LoginMutation = mutationField("login", {
	args: {
		password: nonNull(stringArg()),
		username: nonNull(stringArg()),
	},
	resolve: async (_root, { username, password }, ctx) => {
		const user = await ctx.prisma.user.findFirst({
			include: {
				pages: {
					include: {
						page: true,
					},
				},
				permissions: {
					include: {
						assignedBy: true,
						permission: true,
					},
				},
				permissionsAssigned: {
					include: {
						permission: true,
						user: true,
					},
				},
			},
			where: {
				short: username,
			},
		});

		if (!user) {
			return null;
		}
		// compare hash and password
		if (!(await argon2.verify(user.password, password))) {
			return null;
		}
		// only save the id of the user in the cookie
		ctx.req.session.user = {
			id: user.id,
		};

		await ctx.req.session.save();

		return user;
	},
	type: "User",
});

export const LogoutMutation = mutationField("logout", {
	resolve: (_root, _args, ctx) => {
		if (!ctx.req.session.user) {
			return null;
		}

		const { user } = ctx.req.session;

		ctx.req.session.destroy();

		return user;
	},
	type: "User",
});
