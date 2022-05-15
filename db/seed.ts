/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
import type { User } from "@prisma/client";
import faker from "@faker-js/faker/locale/de";
import { PrismaClient } from "@prisma/client";
import { random, round, sample } from "lodash";

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
const past = new Date("2020");
const present = new Date();

const seedUsers = async () => {
	for (let i = 0; i < random(10, 30); i += 1) {
		const createdAt = seedDate(past, present);
		const did = `did:ethr:${faker.datatype.hexadecimal(40)}`;
		let firstname = "";
		let lastname = "";
		const email = getUnique(() => {
			firstname = faker.name.firstName();
			lastname = faker.name.lastName();
			return faker.internet.email(firstname, lastname);
		});
		const updatedAt = seedDate(createdAt, present);

		console.log(`👉 Creating user ${firstname} ${lastname} (${email})`);
		await prisma.user.create({
			data: {
				createdAt,
				did,
				email,
				firstname,
				lastname,
				updatedAt,
			},
			select: { uuid: true },
		});
	}
};

const seedPizzas = async (users: User[]) => {
	for (let i = 0; i < random(10, 30); i += 1) {
		const createdAt = seedDate(past, present);
		const name = faker.commerce.productName();
		const price = round(random(0, 20, true), 2);
		const updatedAt = seedDate(createdAt, present);
		const createdByUUID = sample(users)!.uuid;

		console.log(`👉 Creating pizza ${name} (for €${price})`);
		await prisma.pizza.create({
			data: {
				createdAt,
				createdByUUID,
				name,
				price,
				updatedAt,
			},
			select: { uuid: true },
		});
	}
};

export default async function main(): Promise<void> {
	console.log(`Start seeding ✨`);

	console.log("🧬 Seeding users...");
	await seedUsers();
	console.log("🧬 ...finished users ✅");

	console.log("🧬 Seeding superuser...");
	await prisma.user.create({
		data: {
			canAccessCMS: true,
			canAccessLab: true,
			canAccessSchoolib: true,
			canAccessUsers: true,
			did: `did:ethr:0x${"0".repeat(40)}`,
			email: "test@magic.link",
			firstname: "Firstname",
			lastname: "Lastname",
			locked: false,
		},
		select: { uuid: true },
	});
	console.log("🧬 ...finished superuser ✅");

	const users = await prisma.user.findMany();

	console.log("🍕 Seeding pizzas...");
	await seedPizzas(users);
	console.log("🍕 ...finished pizzas ✅");

	console.log("⏭ Skipping page seeding (not implemented)");
	console.log("⚠️ Create pages at /admin manually");

	console.log(`✨ Seeding finished.`);
}

main().finally(() => {
	void (async () => {
		await prisma.$disconnect();
	})();
});
