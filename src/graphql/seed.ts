/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import faker from "@faker-js/faker/locale/de";
import { Prisma, PrismaClient, User, Page } from "@prisma/client";
import { sample, sampleSize, random, camelCase } from "lodash";
import { hashPassword } from "$lib/auth";

const prisma = new PrismaClient();

const seedDate = (start: Date, end: Date) =>
	new Date(
		start.getTime() +
			Math.max(Math.random() * (end.getTime() - start.getTime()), 0),
	);

const uniqueData: string[] = [];
const getNumber = (length: number) => {
	return random(10 ** (length - 1), 10 ** length - 1);
};
const makeUnique = (arg: string | number) => {
	let i = 0;
	let computed = "";
	do {
		i += 1;
		computed = `${arg}${(i && getNumber(Math.floor(i / 10))) || ""}`;
	} while (uniqueData.includes(computed));
	return computed;
};
const getUnique = (fn: () => string) => {
	let u: string;
	let i = 0;
	do {
		u = fn();
		if (i >= 10) u = makeUnique(u);
		i += 1;
	} while (uniqueData.includes(u));
	uniqueData.push(u);
	return u;
};

const start = new Date("2020");
const end = new Date();

const seedUser = async (admin?: boolean): Promise<Prisma.UserCreateInput> => {
	let firstname = "";
	let lastname = "";
	const username = getUnique(() => {
		firstname = faker.name.firstName();
		lastname = faker.name.lastName();
		return `${firstname.charAt(0).toLowerCase()}.${lastname.toLowerCase()}`;
	});
	const canMutateUsersSubscription =
		admin ?? sample([true, ...(Array(9).fill(false) as boolean[])])!;
	const createdAt = seedDate(start, end);

	return {
		canMutatePagesSubscription:
			canMutateUsersSubscription ||
			sample([true, ...(Array(19).fill(false) as boolean[])])!,
		canMutateUsersSubscription,
		createdAt,
		firstname,
		lastMutatedAt: seedDate(createdAt, end),
		lastname,
		password: await hashPassword(`${username}1234`),
		username,
	};
};

const seedPage = (
	users: User[],
	canMutateUsersSubscriptionUsers: User[],
): Prisma.PageCreateInput => {
	const seedAuthors = (): Required<
		Pick<
			Prisma.PageCreateInput,
			"users" | "lastMutatedAt" | "canBeMutatedBy" | "createdAt"
		>
	> => {
		const selection = sampleSize(users, random(1, users.length));
		const createdAt = seedDate(start, end);
		const lastMutatedAt = seedDate(
			new Date(
				Math.max(
					...selection.map((author) => author.createdAt.getTime()),
					createdAt.getTime(),
				),
			),
			end,
		);

		const canBeMutatedBy: Prisma.PageCreateInput["canBeMutatedBy"] = {
			create: selection.map(({ id, createdAt: authorCreatedAt }) => {
				const {
					createdAt: canMutateUsersSubscriptionUserCreatedAt,
					id: canMutateUsersSubscriptionUserAdminId,
				} = sample(canMutateUsersSubscriptionUsers)!;
				const canBeMutatedByCreatedAt = seedDate(
					new Date(
						Math.max(
							createdAt.getTime(),
							authorCreatedAt.getTime(),
							canMutateUsersSubscriptionUserCreatedAt.getTime(),
						),
					),
					end,
				);
				return {
					createdAt: canBeMutatedByCreatedAt,
					createdBy: {
						connect: {
							id: canMutateUsersSubscriptionUserAdminId,
						},
					},
					user: {
						connect: { id },
					},
				};
			}),
		};

		const possibleAuthors =
			canBeMutatedBy.create! as Prisma.CanMutatePagesOnUsersCreateWithoutPageInput[];
		const authors = {
			create: sampleSize(
				possibleAuthors,
				random(1, possibleAuthors.length),
			).map(({ createdAt: canBeMutatedByCreatedAt, user }) => ({
				createdAt: seedDate(
					canBeMutatedByCreatedAt as Date,
					lastMutatedAt,
				),
				user,
			})),
		};

		return {
			canBeMutatedBy,
			createdAt,
			lastMutatedAt,
			users: authors,
		};
	};

	const title = getUnique(() => faker.commerce.department());
	const children: Prisma.PageCreateWithoutParentInput[] = [];
	for (let i = 0; i < random(3, 10); i += 1) {
		const childTitle = getUnique(() => faker.commerce.product());
		children.push({
			...seedAuthors(),
			content: `**${faker.commerce.productName()}** - *${faker.commerce.productDescription()}*. ${faker.lorem.paragraphs(
				random(2, 4),
			)}`,
			path: `${camelCase(childTitle)}`,
			title: childTitle,
		});
	}

	return {
		...seedAuthors(),
		children: {
			create: children,
		},
		content: `This is a wonderful description for **${title}**. Here you will find *${faker.commerce.productName()}* and similar pages! As the legend once said: ${faker.lorem.paragraphs(
			random(2, 4),
		)}`,
		path: `${camelCase(title)}`,
		title,
	};
};

const seedUsersCanMutateUsers = (users: User[]): Prisma.UserUpdateArgs[] =>
	users.map(({ id, canMutateUsersSubscription, createdAt }) => ({
		data: {
			canMutateUsers: {
				connectOrCreate: (canMutateUsersSubscription
					? users
					: sampleSize(users, random(1, users.length))
				).map(({ createdAt: _createdAt, id: _id }) => ({
					create: {
						child: {
							connect: {
								id: _id,
							},
						},
						createdAt: seedDate(
							new Date(
								Math.max(
									createdAt.getTime(),
									_createdAt.getTime(),
								),
							),
							end,
						),
						createdBy: {
							connect: {
								id,
							},
						},
					},
					where: {
						parentId_childId: {
							childId: _id,
							parentId: id,
						},
					},
				})),
			},
		},
		where: {
			id,
		},
	}));

const seedUsersCanMutatePages = (
	users: User[],
	pages: Page[],
): Prisma.UserUpdateArgs[] =>
	users.map(({ id, canMutatePagesSubscription, createdAt }) => ({
		data: {
			canMutatePages: {
				connectOrCreate: (canMutatePagesSubscription
					? pages
					: sampleSize(pages, random(1, pages.length))
				).map(({ createdAt: _createdAt, id: _id }) => ({
					create: {
						createdAt: seedDate(
							new Date(
								Math.max(
									createdAt.getTime(),
									_createdAt.getTime(),
								),
							),
							end,
						),
						createdBy: {
							connect: {
								id,
							},
						},
						page: {
							connect: {
								id: _id,
							},
						},
					},
					where: {
						userId_pageId: {
							pageId: _id,
							userId: id,
						},
					},
				})),
			},
		},
		where: {
			id,
		},
	}));

export default async function main(): Promise<void> {
	console.log(`Start seeding ✨`);

	// 1. Create some users 🦭
	for (let i = 0; i < random(10, 30); i += 1) {
		const user = await prisma.user.create({
			data: await seedUser(),
		});
		console.log(
			`👋 Created user ${user.firstname} ${user.lastname} (${user.username}) with id ${user.id}`,
		);
	}
	// 1b. Create some admins 😎
	for (let i = 0; i < random(1, 5); i += 1) {
		const admin = await prisma.user.create({
			data: await seedUser(true),
		});
		console.log(
			`👋 Created admin ${admin.firstname} ${admin.lastname} (${admin.username}) with id ${admin.id}`,
		);
	}
	// 1c. Fetch the created entries for later
	const users = await prisma.user.findMany();
	const canMutateUsersSubscriptionUsers = await prisma.user.findMany({
		where: {
			canMutateUsersSubscription: true,
		},
	});

	// 2. Create pages ✍️
	for (let i = 0; i < random(5, 8); i += 1) {
		const page = await prisma.page.create({
			data: seedPage(users, canMutateUsersSubscriptionUsers),
		});
		console.log(
			`📟 Created page ${page.title} (${page.path}) with id ${page.id}`,
		);
	}
	const pages = await prisma.page.findMany();

	// 3. Tie permissions together 👀
	const canMutateUsersUsersData = seedUsersCanMutateUsers(users);
	for (const canMutateUsersUserData of canMutateUsersUsersData) {
		const canMutateUsersUser = await prisma.user.update(
			canMutateUsersUserData,
		);
		console.log(
			`💻 Gave ${canMutateUsersUser.firstname} ${canMutateUsersUser.lastname} (${canMutateUsersUser.username}) his permissions`,
		);
	}
	const canMutatePagesUsersData = seedUsersCanMutatePages(users, pages);
	for (const canMutatePagesUserData of canMutatePagesUsersData) {
		const canMutatePagesUser = await prisma.user.update(
			canMutatePagesUserData,
		);
		console.log(
			`📝 Gave ${canMutatePagesUser.firstname} ${canMutatePagesUser.lastname} (${canMutatePagesUser.username}) his permissions`,
		);
	}

	console.log(`✨ Seeding finished.`);
}

main().finally(() => {
	void (async () => {
		await prisma.$disconnect();
	})();
});
