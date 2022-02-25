import type { CanMutateUsersOnUsers } from "@prisma/client";
import {
	objectType,
	nonNull,
	intArg,
	mutationField,
	stringArg,
	queryField,
	booleanArg,
} from "nexus";
import { hashPassword, verifyPassword } from "$lib/auth";
import { undefinedOrValue } from "$lib/util";

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
	authorize: async (_root, { id }, ctx) =>
		!!(await ctx.prisma.user.findFirst({
			where: {
				id: ctx.req.session.user?.id ?? 0,
				canMutateUsers: {
					some: {
						child: {
							id,
						},
					},
				},
			},
		})),
	resolve: (_root, { id }, ctx) =>
		ctx.prisma.user.findUnique({ where: { id } }),
	type: "User",
});
export const UsersQuery = queryField("users", {
	authorize: (_root, _args, ctx) => !!ctx.req.session.user,
	list: true,
	resolve: async (_root, _args, ctx) =>
		await ctx.prisma.user.findMany({
			where: {
				canBeMutatedBy: {
					some: {
						parentId: ctx.req.session.user!.id,
					},
				},
			},
		}),
	type: "User",
});

export const LoginMutation = mutationField("login", {
	args: {
		password: nonNull(stringArg()),
		username: nonNull(stringArg()),
	},
	authorize: (_root, _args, ctx) => !ctx.req.session,
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

const createUsername = (firstname: string, lastname: string): string => {
	return `${
		firstname.length > 0 ? firstname.charAt(0).toLowerCase() : ""
	}.${lastname.toLowerCase()}`;
};

export const CreateUserMutation = mutationField("createUser", {
	args: {
		canMutatePagesSubscription: nonNull(booleanArg()),
		canMutateUsersSubscription: nonNull(booleanArg()),
		firstname: nonNull(stringArg()),
		lastname: nonNull(stringArg()),
		password: nonNull(stringArg()),
	},
	authorize: async (_root, _args, ctx) =>
		(
			await ctx.prisma.user.findUnique({
				where: {
					id: ctx.req.session.user?.id,
				},
			})
		)?.canMutateUsersSubscription ?? false,
	resolve: async (
		_root,
		{
			canMutatePagesSubscription,
			canMutateUsersSubscription,
			firstname,
			lastname,
			password,
		},
		ctx,
	) => {
		const { id } = await ctx.prisma.user.create({
			data: {
				canMutatePagesSubscription,
				canMutateUsersSubscription,
				firstname,
				lastname,
				password: await hashPassword(password),
				username: createUsername(firstname, lastname),
			},
		});
		await ctx.prisma.$transaction([
			(
				await ctx.prisma.user.findMany({
					OR: [
						{
							canMutateUsersSubscription: true,
						},
						{
							id,
						},
					],
				})
			).map(({ id: userId }) => {
				return ctx.prisma.user.update({
					data: {
						canMutateUsers: {
							connectOrCreate: {
								create: {
									childId: id,
								},
								where: {
									parentId_childId: {
										childId: id,
										parentId: userId,
									},
								},
							},
						},
					},
					where: {
						id: userId,
					},
				});
			}),
		]);
	},
	type: "User",
});

export const EditUserMutation = mutationField("editUser", {
	args: {
		canMutatePagesSubscription: booleanArg(),
		canMutateUsersSubscription: booleanArg(),
		firstname: stringArg(),
		id: nonNull(intArg()),
		lastname: stringArg(),
		password: stringArg(),
	},
	authorize: (
		_root,
		{ id, canMutatePagesSubscription, canMutateUsersSubscription },
		ctx,
	) => {
		// every user can edit himself but not change permission attributes
		if (
			id === ctx.req.session.user?.id &&
			canMutatePagesSubscription == null &&
			canMutateUsersSubscription == null
		) {
			return true;
		}

		return canMutateUser(id, ctx);
	},
	resolve: async (
		_root,
		{
			canMutatePagesSubscription,
			canMutateUsersSubscription,
			firstname,
			id,
			lastname,
			password,
		},
		ctx,
	) => {
		let username: string | undefined;

		// reCreate the username if either firstname or lastname will be changed
		if (firstname && lastname) {
			username = createUsername(firstname, lastname);
		} else if (firstname || lastname) {
			const user = await ctx.prisma.user.findUnique({
				where: {
					id,
				},
			});

			if (user != null) {
				username = createUsername(
					firstname || user.firstname,
					lastname || user.lastname,
				);
			}
		}

		let newPassword: string | undefined;
		// If the user wants to set a new password --> hash it
		if (password) {
			newPassword = await hashPassword(password);
		}

		return ctx.prisma.user.update({
			data: {
				canMutatePagesSubscription: undefinedOrValue(
					canMutatePagesSubscription,
				),
				canMutateUsersSubscription: undefinedOrValue(
					canMutateUsersSubscription,
				),
				firstname: undefinedOrValue(firstname),
				lastname: undefinedOrValue(lastname),
				password: newPassword,
				username,
			},
			where: {
				id,
			},
		});
	},
	type: "User",
});
export const DeleteUserMutation = mutationField("deleteUser", {
	args: {
		id: nonNull(intArg()),
	},
	authorize: (_root, { id }, ctx) => {
		return canMutateUser(id, ctx);
	},
	resolve: async (_root, { id }, ctx) => {
		const deleteUser = ctx.prisma.user.delete({
			where: {
				id,
			},
		});

		/*
		delete all user permissions that belong to this user (parentId) or
		where this user is referenced (childId)
		*/
		const deleteUserPermissions =
			ctx.prisma.canMutateUsersOnUsers.deleteMany({
				where: {
					OR: [
						{
							childId: id,
						},
						{
							parentId: id,
						},
					],
				},
			});

		/*
		Delete all pagePermissions this user has
		*/
		const deletePagePermissions =
			ctx.prisma.canMutatePagesOnUsers.deleteMany({
				where: {
					userId: id,
				},
			});

		const deletePageOnUser = ctx.prisma.pagesOnUsers.deleteMany({
			where: {
				userId: id,
			},
		});

		const transaction = await ctx.prisma.$transaction([
			deletePageOnUser,
			deletePagePermissions,
			deleteUserPermissions,
			deleteUser,
		]);

		return transaction[3];
	},
	type: "User",
});
