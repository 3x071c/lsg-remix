/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import faker from "@faker-js/faker/locale/de";
import { Prisma, PrismaClient } from "@prisma/client";
import { random } from "lodash";
import { hashPassword } from "~app/auth";

const prisma = new PrismaClient();

const seedDate = (start: Date, end: Date) =>
	new Date(
		start.getTime() +
			Math.max(Math.random() * (end.getTime() - start.getTime()), 0),
	);

const uniqueData: string[] = [];
const makeUnique = (arg: string | number) => {
	let i = 0;
	let computed = "";
	do {
		computed = `${arg}${i}`;
		i += 1;
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

const seedUser = async (): Promise<Prisma.UserCreateInput> => {
	let firstname = "";
	let lastname = "";
	const username = getUnique(() => {
		firstname = faker.name.firstName();
		lastname = faker.name.lastName();
		return `${firstname.charAt(0).toLowerCase()}.${lastname.toLowerCase()}`;
	});
	const createdAt = seedDate(start, end);

	return {
		createdAt,
		firstname,
		lastname,
		password: await hashPassword(`${username}1234`),
		updatedAt: seedDate(createdAt, end),
		username,
	};
};

const seedPageCategory = (): Prisma.PageCategoryCreateInput => {
	const createdAt = seedDate(start, end);

	return {
		createdAt,
		name: getUnique(() => faker.commerce.department()),
		updatedAt: seedDate(createdAt, end),
	};
};

const seedPage = (categoryId: number): Prisma.PageCreateInput => {
	const createdAt = seedDate(start, end);
	const title = getUnique(() => faker.commerce.department());

	return {
		category: {
			connect: {
				id: categoryId,
			},
		},
		content: `This is a wonderful description for **${title}**. Here you will find *${faker.commerce.productName()}* and similar pages! As the legend once said: ${faker.lorem.paragraphs(
			random(2, 4),
		)}`,
		createdAt,
		title,
		updatedAt: seedDate(createdAt, end),
	};
};

export default async function main(): Promise<void> {
	console.log(`Start seeding ✨`);

	// 1. Create some users 🦭
	for (let i = 0; i < random(10, 30); i += 1) {
		const user = await prisma.user.create({
			data: await seedUser(),
		});
		console.log(
			`👋 Created user ${user.firstname} ${user.lastname} (#${user.id}) with username ${user.username}`,
		);
	}

	// 2. Create page categories 🙌
	// TODO: Use real data instead of faker randomness
	for (let i = 0; i < random(5, 8); i += 1) {
		const pageCategory = await prisma.pageCategory.create({
			data: seedPageCategory(),
		});
		console.log(
			`🐈 Created category ${pageCategory.name} (#${pageCategory.id})`,
		);
	}
	const pageCategories = await prisma.pageCategory.findMany();

	// 3. Create pages ✍️
	for (const { id: categoryId, name: categoryName } of pageCategories) {
		for (let i = 0; i < random(3, 8); i += 1) {
			const page = await prisma.page.create({
				data: seedPage(categoryId),
			});
			console.log(
				`📟 Created page ${page.title} (#${page.id}) on ${categoryName}`,
			);
		}
	}

	console.log(`✨ Seeding finished.`);
}

main().finally(() => {
	void (async () => {
		await prisma.$disconnect();
	})();
});
