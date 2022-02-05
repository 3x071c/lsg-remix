import {
	objectType,
	nonNull,
	intArg,
	mutationField,
	stringArg,
	queryField,
} from "nexus";
import { verifyPassword } from "$lib/auth";

export const User = objectType({
	definition: (t) => {
		t.int("id");
		t.string("firstname");
		t.string("lastname");
		t.string("username");
		t.list.field("pages", {
			resolve: ({ id }, _args, ctx) =>
				ctx.prisma.user.findUnique({ where: { id: id! } }).pages(),
			type: "PagesOnUsers",
		});
		t.list.field("canBeMutatedBy", {
			resolve: ({ id }, _args, ctx) =>
				ctx.prisma.user
					.findUnique({ where: { id: id! } })
					.canBeMutatedBy(),
			type: "CanMutateUsersOnUsers",
		});
		t.list.field("canMutateUsers", {
			resolve: ({ id }, _args, ctx) =>
				ctx.prisma.user
					.findUnique({ where: { id: id! } })
					.canMutateUsers(),
			type: "CanMutateUsersOnUsers",
		});
		t.boolean("canMutateUsersSubscription");
		t.list.field("canMutateUsersAssigned", {
			resolve: ({ id }, _args, ctx) =>
				ctx.prisma.user
					.findUnique({ where: { id: id! } })
					.canMutateUsersAssigned(),
			type: "CanMutateUsersOnUsers",
		});
		t.list.field("canMutatePages", {
			resolve: ({ id }, _args, ctx) =>
				ctx.prisma.user
					.findUnique({ where: { id: id! } })
					.canMutatePages(),
			type: "CanMutatePagesOnUsers",
		});
		t.boolean("canMutatePagesSubscription");
		t.list.field("canMutatePagesAssigned", {
			resolve: ({ id }, _args, ctx) =>
				ctx.prisma.user
					.findUnique({ where: { id: id! } })
					.canMutatePagesAssigned(),
			type: "CanMutatePagesOnUsers",
		});
		t.date("lastMutatedAt");
		t.date("createdAt");
	},
	name: "User",
});

export const UserQuery = queryField("user", {
	args: {
		id: nonNull(intArg()),
	},
	resolve: (_root, { id }, ctx) =>
		ctx.prisma.user.findUnique({ where: { id } }),
	type: "User",
});
export const UsersQuery = queryField("users", {
	authorize: (_root, _args, ctx) => !!ctx.req.session.user,
	list: true,
	resolve: (_root, _args, ctx) => ctx.prisma.user.findMany(),
	type: "User",
});

export const LoginMutation = mutationField("login", {
	args: {
		password: nonNull(stringArg()),
		username: nonNull(stringArg()),
	},
	resolve: async (_root, { username, password }, ctx) => {
		const user = await ctx.prisma.user.findUnique({
			where: {
				username,
			},
		});

		if (
			!(await verifyPassword(
				password,
				user?.password ?? "preventTimingAttacks123",
			)) ||
			!user
		)
			throw new Error("Invalid username or password");

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
		if (!ctx.req.session.user) throw new Error("Not signed in");

		const { user } = ctx.req.session;
		ctx.req.session.destroy();

		return user;
	},
	type: "User",
});
