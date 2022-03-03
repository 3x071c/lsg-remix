import {
	objectType,
	nonNull,
	intArg,
	mutationField,
	stringArg,
	queryField,
	booleanArg,
} from "nexus";
import { hashPassword, verifyPassword, shouldRehashPassword } from "$lib/auth";

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
		!!ctx.req.session.user &&
		!!(await ctx.prisma.canMutateUsersOnUsers.findUnique({
			where: {
				parentId_childId: {
					childId: id,
					parentId: ctx.req.session.user.id,
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
	resolve: (_root, _args, ctx) =>
		ctx.prisma.user.findMany({
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
	authorize: (_root, _args, ctx) => !ctx.req.session.user,
	resolve: async (_root, { username, password }, ctx) => {
		const user = await ctx.prisma.user.findUnique({
			where: {
				username,
			},
		});

		if (
			!(await verifyPassword(
				password,
				user?.password ??
					"$argon2i$v=19$m=4096,t=3,p=1$UFp3ZFmnUdIc84t1M7zpXQ$o+I1FxwYr0ulRgG4epYb+EIWxI/g8lEiLXTv4Ps1W8k",
			)) ||
			!user
		)
			throw new Error("Invalid username or password");

		if (shouldRehashPassword(user.password)) {
			await ctx.prisma.user.update({
				data: {
					password: await hashPassword(password),
				},
				where: {
					id: user.id,
				},
			});
		}

		ctx.req.session.user = {
			id: user.id,
		};

		await ctx.req.session.save();

		return user;
	},
	type: "User",
});
export const LogoutMutation = mutationField("logout", {
	authorize: (_root, _args, ctx) => !!ctx.req.session.user,
	resolve: (_root, _args, ctx) => {
		const user = ctx.req.session.user!;
		ctx.req.session.destroy();
		return user;
	},
	type: "User",
});

export const CreateUserMutation = mutationField("createUser", {
	args: {
		canMutatePagesSubscription: nonNull(booleanArg()),
		canMutateUsersSubscription: nonNull(booleanArg()),
		firstname: nonNull(stringArg()),
		lastname: nonNull(stringArg()),
		password: nonNull(stringArg()),
		username: nonNull(stringArg()),
	},
	authorize: async (_root, _args, ctx) =>
		!!ctx.req.session.user &&
		!!(
			await ctx.prisma.user.findUnique({
				where: {
					id: ctx.req.session.user.id,
				},
			})
		)?.canMutateUsersSubscription,
	resolve: async (
		_root,
		{
			password,
			canMutatePagesSubscription,
			canMutateUsersSubscription,
			...args
		},
		ctx,
	) => {
		const createdUser = await ctx.prisma.user.create({
			data: {
				...args,
				canMutatePages: {
					create: canMutatePagesSubscription
						? [
								...(
									await ctx.prisma.page.findMany()
								).map((page) => {
									return {
										createdById: ctx.req.session.user!.id,
										pageId: page.id,
									};
								}),
						  ]
						: [],
				},
				canMutatePagesSubscription,
				canMutateUsers: {
					create: canMutateUsersSubscription
						? [
								...(
									await ctx.prisma.user.findMany()
								).map((user) => {
									return {
										childId: user.id,
										createdById: ctx.req.session.user!.id,
									};
								}),
						  ]
						: [],
				},
				canMutateUsersSubscription,
				password: await hashPassword(password),
			},
		});

		await ctx.prisma.$transaction([
			...(
				await ctx.prisma.user.findMany({
					where: {
						OR: [
							{
								canMutateUsersSubscription: true,
							},
							{
								id: createdUser.id,
							},
						],
					},
				})
			).map(({ id: userId }) => {
				return ctx.prisma.user.update({
					data: {
						canMutateUsers: {
							connectOrCreate: {
								create: {
									childId: createdUser.id,
									createdById: ctx.req.session.user!.id,
								},
								where: {
									parentId_childId: {
										childId: createdUser.id,
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

		return createdUser;
	},
	type: "User",
});

export const EditUserMutation = mutationField("editUser", {
	args: {
		firstname: stringArg(),
		id: nonNull(intArg()),
		lastname: stringArg(),
		password: stringArg(),
	},
	authorize: async (_root, { id }, ctx) =>
		!!ctx.req.session.user &&
		!!(await ctx.prisma.canMutateUsersOnUsers.findUnique({
			where: {
				parentId_childId: {
					childId: id,
					parentId: ctx.req.session.user.id,
				},
			},
		})),
	resolve: async (_root, { id, password, ...args }, ctx) =>
		ctx.prisma.user.update({
			// TODO Handle editing permissions
			data: {
				...Object.fromEntries(
					Object.entries(args).filter(([, v]) => v !== null),
				),
				password: password ? await hashPassword(password) : undefined,
			},
			where: {
				id,
			},
		}),
	type: "User",
});
export const DeleteUserMutation = mutationField("deleteUser", {
	args: {
		id: nonNull(intArg()),
	},
	authorize: async (_root, { id }, ctx) =>
		!!ctx.req.session.user &&
		!!(await ctx.prisma.canMutateUsersOnUsers.findUnique({
			where: {
				parentId_childId: {
					childId: id,
					parentId: ctx.req.session.user.id,
				},
			},
		})),
	resolve: async (_root, { id }, ctx) =>
		(
			await ctx.prisma.$transaction([
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
				}),
				ctx.prisma.canMutatePagesOnUsers.deleteMany({
					where: {
						userId: id,
					},
				}),
				ctx.prisma.pagesOnUsers.deleteMany({
					where: {
						userId: id,
					},
				}),
				ctx.prisma.user.delete({
					where: {
						id,
					},
				}),
			])
		)[3],
	type: "User",
});
