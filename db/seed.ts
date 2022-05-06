/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
import faker from "@faker-js/faker/locale/de";
import { PrismaClient } from "@prisma/client";
import { random } from "lodash";

const prisma = new PrismaClient();
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
const seedDate = (start: Date, end: Date) =>
	new Date(
		start.getTime() +
			Math.max(Math.random() * (end.getTime() - start.getTime()), 0),
	);
const wayback = new Date("2020");
const today = new Date();

const seedPizzas = async () => {
	await prisma.pizza.createMany({
		data: [
			{
				name: "Diavola",
				price: 7.9,
			},
			{
				name: "Prosciutto",
				price: 6.4,
			},
			{
				name: "Calzone",
				price: 7.9,
			},
			{
				name: "Pane",
				price: 3.5,
			},
			{
				name: "Magherita",
				price: 5.3,
			},
			{
				name: "Monte Bianco",
				price: 8.5,
			},
			{
				name: "4 Kaese",
				price: 7.9,
			},
			{
				name: "Salami",
				price: 6.4,
			},
			{
				name: "Tonno",
				price: 7.9,
			},
			{
				name: "Regina",
				price: 7.4,
			},
		],
	});
};

export default async function main(): Promise<void> {
	console.log(`Start seeding ✨`);

	console.log("🧬 Seeding users...");
	for (let i = 0; i < random(10, 30); i += 1) {
		let firstname = "";
		let lastname = "";
		const email = getUnique(() => {
			firstname = faker.name.firstName();
			lastname = faker.name.lastName();
			return faker.internet.email(firstname, lastname);
		});
		const createdAt = seedDate(wayback, today);
		const did = `did:ethr:${faker.datatype.hexadecimal(40)}`;

		console.log(`👉 Creating user ${firstname} ${lastname} (${email})`);
		await prisma.user.create({
			data: {
				createdAt,
				did,
				email,
				firstname,
				lastname,
				updatedAt: seedDate(createdAt, today),
			},
		});
	}
	console.log("🧬 ...finished users ✅");

	console.log("⏭ Skipping page seeding (not implemented)");
	console.log("⚠️ Create pages at /admin manually");

	await seedPizzas();

	console.log(`✨ Seeding finished.`);
}

main().finally(() => {
	void (async () => {
		await prisma.$disconnect();
	})();
});
