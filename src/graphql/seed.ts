/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */

import { randomUUID } from "crypto";
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
const getUnique = (length?: number, format?: "string" | "number") => {
	const len = length ?? 36;
	const cast = format ?? "string";
	let u: string;
	if (cast === "string") {
		do {
			u = Array.from({ length: Math.ceil(len / 36) }, () => randomUUID())
				.join("")
				.substring(0, len);
		} while (uniqueData.includes(u));
	} else {
		do {
			u = [
				random(1, 9),
				...Array.from({ length: Math.ceil(len - 1) }, () =>
					random(0, 9),
				),
			].join("");
		} while (uniqueData.includes(u));
	}
	uniqueData.push(u);
	return cast === "number" ? Number(u) : u;
};
const start = new Date("2020");
const end = new Date();

const seedUser = async (
	_start?: Date,
	admin?: boolean,
): Promise<Prisma.UserCreateInput> => {
	const firstname = faker.name.firstName();
	const lastname = faker.name.lastName();
	const username = `${firstname
		.charAt(0)
		.toLowerCase()}.${lastname.toLowerCase()}${getUnique(2, "number")}`;
	const canMutateUsersSubscription =
		admin ?? sample([true, ...(Array(9).fill(false) as boolean[])])!;
	const createdAt = seedDate(_start ?? start, end);

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

const seedPage = async (
	users: User[],
	canMutateUsersSubscriptionUsers: User[],
	currentPage: number,
	totalPages: number,
): Promise<Prisma.PageCreateInput> => {
	const logPrefix = () =>
		`🪵 [${new Date().getTime()}] [${currentPage}/${totalPages}]`;
	console.log(logPrefix(), `users:`, users);
	console.log(
		logPrefix(),
		`canMutateUsersSubscriptionUsers:`,
		canMutateUsersSubscriptionUsers,
	);
	console.log(logPrefix(), `currentPage:`, currentPage);
	console.log(logPrefix(), `totalPages:`, totalPages);
	const seedAuthors = async (
		currentAuthor: number,
		totalAuthors: number,
	): Promise<
		Required<
			Pick<
				Prisma.PageCreateInput,
				"users" | "lastMutatedAt" | "canBeMutatedBy" | "createdAt"
			>
		>
	> => {
		const logPrefix2 = () =>
			`${logPrefix()} [${currentAuthor}/${totalAuthors}]`;
		const authors = sampleSize(users, random(1, users.length));
		const createdAt = seedDate(start, end);
		const lastMutatedAt = seedDate(
			new Date(
				Math.max(
					...authors.map((author) => author.createdAt.getTime()),
					createdAt.getTime(),
				),
			),
			end,
		);

		console.log(logPrefix2(), `authors:`, authors);
		console.log(logPrefix2(), `createdAt:`, createdAt);
		console.log(logPrefix2(), `lastMutatedAt:`, lastMutatedAt);

		const canBeMutatedBy: Prisma.PageCreateInput["canBeMutatedBy"] = {
			create: await Promise.all(
				authors.map(async ({ id, createdAt: authorCreatedAt }, i) => {
					const logPrefix3 = () =>
						`${logPrefix2()} [${i + 1}/${authors.length}]`;
					console.log(logPrefix3(), `id:`, id);
					console.log(logPrefix3(), `createdAt:`, authorCreatedAt);
					const canBeMutatedByCreatedAt = seedDate(
						new Date(
							Math.max(
								createdAt.getTime(),
								authorCreatedAt.getTime(),
							),
						),
						end,
					);
					console.log(
						logPrefix3(),
						`canBeMutatedByCreatedAt:`,
						canBeMutatedByCreatedAt,
					);

					const canBeMutatedByCreatedBy =
						canMutateUsersSubscriptionUsers.filter(
							(user) =>
								user.createdAt.getTime() <
								canBeMutatedByCreatedAt.getTime(),
						);
					console.log(
						logPrefix3(),
						`canBeMutatedByCreatedBy:`,
						canBeMutatedByCreatedBy,
					);

					const ret = {
						createdAt: canBeMutatedByCreatedAt,
						createdBy: canBeMutatedByCreatedBy.length
							? {
									connect: {
										id: sample(canBeMutatedByCreatedBy)!.id,
									},
							  }
							: {
									create: {
										...(await seedUser(
											canBeMutatedByCreatedAt,
											true,
										)),
									},
							  },
						user: {
							connect: { id },
						},
					};
					console.log(logPrefix3(), `canBeMutatedBy[]:`, ret);
					return ret;
				}),
			),
		};
		console.log(logPrefix2(), `canBeMutatedBy:`, canBeMutatedBy);

		const ret = {
			canBeMutatedBy,
			createdAt,
			lastMutatedAt,
			users: {
				create: (
					canBeMutatedBy.create! as Prisma.CanMutatePagesOnUsersCreateWithoutPageInput[]
				).map(({ createdAt: canBeMutatedByCreatedAt, user }) => ({
					createdAt: seedDate(
						canBeMutatedByCreatedAt as Date,
						lastMutatedAt,
					),
					user,
				})),
			},
		};
		console.log(logPrefix2(), `seedAuthors:`, ret);
		return ret;
	};

	const title = faker.commerce.department();
	const children: Prisma.PageCreateWithoutParentInput[] = [];
	const totalIterations = random(3, 10) + 1;
	console.log(logPrefix(), `title:`, title);
	console.log(logPrefix(), `children:`, children);
	console.log(logPrefix(), `totalIterations:`, totalIterations);
	for (let i = 1; i <= totalIterations - 1; i += 1) {
		const logPrefix2 = () => `${logPrefix()} [${i}/${totalIterations}]`;
		const childTitle = faker.commerce.product();
		console.log(logPrefix2(), `childTitle:`, childTitle);
		children.push({
			...(await seedAuthors(i, totalIterations)),
			content: `**${faker.commerce.productName()}** - *${faker.commerce.productDescription()}*. ${faker.lorem.paragraphs(
				random(2, 4),
			)}`,
			path: `${camelCase(childTitle)}${getUnique(8)}`,
			title: childTitle,
		});
		console.log(logPrefix2(), `children:`, children);
	}

	const ret = {
		...(await seedAuthors(totalIterations, totalIterations)),
		children: {
			create: children,
		},
		content: `This is a wonderful description for **${title}**. Here you will find *${faker.commerce.productName()}* and similar pages! As the legend once said: ${faker.lorem.paragraphs(
			random(2, 4),
		)}`,
		path: `${camelCase(title)}${getUnique(8)}`,
		title,
	};
	console.log(logPrefix(), `seedPage:`, ret);
	return ret;
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
	for (let i = 0; i < random(20, 50); i += 1) {
		const user = await prisma.user.create({
			data: await seedUser(),
		});
		console.log(
			`👋 Created user ${user.firstname} ${user.lastname} (${user.username}) with id ${user.id}`,
		);
	}
	const users = await prisma.user.findMany();
	const canMutateUsersSubscriptionUsers = await prisma.user.findMany({
		where: {
			canMutateUsersSubscription: true,
		},
	});

	// 2. Create pages ✍️
	const totalPages = random(5, 8);
	for (let i = 1; i <= totalPages; i += 1) {
		const page = await prisma.page.create({
			data: await seedPage(
				users,
				canMutateUsersSubscriptionUsers,
				i,
				totalPages,
			),
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

void main();
