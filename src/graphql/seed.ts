/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import { Prisma, PrismaClient } from "@prisma/client";
import * as faker from "faker/locale/de";

// shameless paste from mdn
function getRandomIntInclusive(_min: number, _max: number): number {
	const min = Math.ceil(_min);
	const max = Math.floor(_max);
	return Math.floor(Math.random() * (max - min + 1) + min);
}

const prisma = new PrismaClient();

const homepage: Prisma.PageCreateInput = {
	children: {
		connect: [],
	},
	content: "Das Louise-Schroeder-Gymnasium",
	isHero: true,
	title: "Home",
};
const pageData: Prisma.PageCreateInput[] = [
	homepage,
	...Array.from({ length: getRandomIntInclusive(5, 8) }, () => {
		const dep = faker.commerce.department();
		const children = Array.from(
			{ length: getRandomIntInclusive(3, 10) },
			() => ({
				content: `**${faker.commerce.productName()}** - *${faker.commerce.productDescription()}*. ${faker.lorem.paragraphs(
					getRandomIntInclusive(2, 4),
				)}`,
				title: faker.commerce.product(),
			}),
		);
		return {
			children: { create: children },
			content: `This is a wonderful description for **${dep}**. Here you will find *${faker.commerce.productName()}* and similar pages! As the legend once said: ${faker.lorem.paragraphs(
				getRandomIntInclusive(2, 4),
			)}`,
			title: dep,
		};
	}),
];

export default async function main(): Promise<void> {
	console.log(`Start seeding ...`);

	for (const p of pageData) {
		const page = await prisma.page.create({
			data: p,
		});
		console.log(`[Page(${page.id})] title="${page.title}"`);
	}

	console.log(`Seeding finished.`);
}

void main();
