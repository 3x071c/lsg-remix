/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */

import faker from "@faker-js/faker/locale/de";
import {
	Prisma,
	PrismaClient,
	User,
	Page,
	Permission,
	PagesOnUsers,
} from "@prisma/client";
import { sample, sampleSize, random, times, flatten, clamp } from "lodash";

type PageWithRelations = Page & {
	authors: PagesOnUsers[];
	children: Page[];
};
const partial = (i: number) => (1 / (i + 1)) * i;
const distort = (str: string, progress: number) =>
	sampleSize(
		str.split(/\s+/g),
		Math.round(
			str.split(/\s+/g).length *
				clamp(
					random(partial(progress), partial(progress) * 2, true),
					0,
					1,
				),
		),
	).join(" ");

const prisma = new PrismaClient();

const seedUsers = (): Prisma.UserCreateInput[] =>
	times(random(5, 8), () => {
		const firstName = faker.name.firstName();
		const lastName = faker.name.lastName();
		return {
			name: `${firstName} ${lastName}`,
			short: `${firstName
				.charAt(0)
				.toLowerCase()}.${lastName.toLowerCase()}`,
		};
	});

const seedPageAuthors = (users: User[]): Prisma.PageCreateInput["authors"] => {
	const authors = sampleSize(users, random(1, users.length));
	return {
		create: authors.map((author) => ({
			user: {
				connect: {
					id: author.id,
				},
			},
		})),
	};
};
const seedPageChildren = (
	users: User[],
): Prisma.PageCreateInput["children"] => ({
	create: times(random(3, 10), () => {
		const title = faker.commerce.product();
		return {
			authors: seedPageAuthors(users),
			content: `**${faker.commerce.productName()}** - *${faker.commerce.productDescription()}*. ${faker.lorem.paragraphs(
				random(2, 4),
			)}`,
			title,
		};
	}),
});
const seedPages = (users: User[]) =>
	times(random(5, 8), () => {
		const title = faker.commerce.department();
		return {
			authors: seedPageAuthors(users),
			children: seedPageChildren(users),
			content: `This is a wonderful description for **${title}**. Here you will find *${faker.commerce.productName()}* and similar pages! As the legend once said: ${faker.lorem.paragraphs(
				random(2, 4),
			)}`,
			title,
		};
	});
const seedPagesHistory = (pages: Page[]): Prisma.PageHistoryCreateInput[] =>
	flatten(
		pages.map(({ title, content, id }) =>
			times(random(1, 10), (i) => ({
				content: distort(content, i),
				page: {
					connect: {
						id,
					},
				},
				title: distort(title, i),
			})),
		),
	);

const seedCanMutateUserPermission = (
	users: User[],
): Prisma.PermissionCreateInput => {
	const selected = sampleSize(users, random(1, users.length));
	return {
		name: "canMutateUsers",
		users: {
			create: selected.map((user) => ({
				assignedBy: {
					connect: {
						id: user.id,
					},
				},
				user: {
					connect: {
						id: user.id,
					},
				},
			})),
		},
	};
};
const seedCanMutatePagesPermission = (
	canMutateUserUsers: User[],
): Prisma.PermissionCreateInput => {
	return {
		name: "canMutatePages",
		users: {
			create: canMutateUserUsers.map((user) => ({
				assignedBy: {
					connect: {
						id: user.id,
					},
				},
				user: {
					connect: {
						id: user.id,
					},
				},
			})),
		},
	};
};
const seedCanMutatePagePermissions = (
	canMutateUserUsers: User[],
	pages: PageWithRelations[],
): Prisma.PermissionCreateInput[] =>
	pages.map(({ id, authors }) => ({
		name: `canMutatePage${id}`,
		users: {
			create: authors.map((author) => ({
				assignedBy: {
					connect: {
						id: sample(canMutateUserUsers)!.id,
					},
				},
				user: {
					connect: {
						id: author.userId,
					},
				},
			})),
		},
	}));

export default async function main(): Promise<void> {
	console.log(`Start seeding ...`);

	// 1. Create some users 🦭
	const userData = seedUsers();
	for (const u of userData) {
		const user = await prisma.user.create({
			data: u,
		});
		console.log(
			`👋 Created user ${user.name} (${user.short}) with id ${user.id}`,
		);
	}
	const users: User[] = await prisma.user.findMany();

	// 2. Create pages ✍️
	const pageData = seedPages(users);
	for (const p of pageData) {
		console.log(`📟 Creating page ${p.title}`);
		const page = await prisma.page.create({
			data: p,
		});
		console.log(`📟 Created page ${page.title} with id ${page.id}`);
	}
	const pages: PageWithRelations[] = await prisma.page.findMany({
		include: {
			authors: true,
			children: true,
		},
	});
	const pageHistoryData = seedPagesHistory(pages);
	for (const p of pageHistoryData) {
		const pageHistory = await prisma.pageHistory.create({ data: p });
		console.log(
			`🔄 Created history ${pageHistory.title} with id ${pageHistory.id}`,
		);
	}

	// 3. Tie permissions together 👀
	const permissions: Permission[] = [];
	const canMutateUserPermission = await prisma.permission.create({
		data: seedCanMutateUserPermission(users),
	});
	console.log(
		`👍 Created ${canMutateUserPermission.name} permission with id ${canMutateUserPermission.id}`,
	);
	permissions.push(canMutateUserPermission);
	const canMutateUserUsers = await prisma.user.findMany({
		where: {
			permissions: {
				some: {
					permission: {
						name: "canMutateUsers",
					},
				},
			},
		},
	});

	const canMutatePagesPermission = await prisma.permission.create({
		data: seedCanMutatePagesPermission(canMutateUserUsers),
	});
	console.log(
		`👍 Created ${canMutatePagesPermission.name} permission with id ${canMutatePagesPermission.id}`,
	);

	const canMutatePagePermissionData = seedCanMutatePagePermissions(
		canMutateUserUsers,
		pages,
	);
	for (const p of canMutatePagePermissionData) {
		const canMutatePagePermission = await prisma.permission.create({
			data: p,
		});
		console.log(
			`👍 Created ${canMutatePagePermission.name} permission with id ${canMutatePagePermission.id}`,
		);
		permissions.push(canMutatePagePermission);
	}

	console.log(`Seeding finished.`);
}

void main();
