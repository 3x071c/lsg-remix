/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
import { readdir as readDir, readFile } from "fs/promises";
import { parse, resolve } from "path";
import faker from "@faker-js/faker/locale/de";
import { PrismaClient } from "@prisma/client";
import { random } from "lodash";
import { hashPassword } from "~app/auth";

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

export default async function main(): Promise<void> {
	console.log(`Start seeding ✨`);

	console.log("🧬 Seeding users...");
	console.log(`⚠️ Creating development user (dev:dev)`);
	await prisma.user.create({
		data: {
			firstname: "John",
			lastname: "Doe",
			password: await hashPassword("dev"),
			username: "dev",
		},
	});
	for (let i = 0; i < random(10, 30); i += 1) {
		let firstname = "";
		let lastname = "";
		const username = getUnique(() => {
			firstname = faker.name.firstName();
			lastname = faker.name.lastName();
			return `${firstname
				.charAt(0)
				.toLowerCase()}.${lastname.toLowerCase()}`;
		});
		const createdAt = seedDate(wayback, today);

		console.log(`👉 Creating user ${firstname} ${lastname} (${username})`);
		await prisma.user.create({
			data: {
				createdAt,
				firstname,
				lastname,
				password: await hashPassword(`${username}1234`),
				updatedAt: seedDate(createdAt, today),
				username,
			},
		});
	}
	console.log("🧬 ...finished users ✅");

	console.log("📃 Seeding pages...");
	const base = resolve("db", "data");
	for (const dirname of await readDir(base)) {
		const { name } = parse(dirname);
		console.log(`➡️ Creating category ${name}`);
		const { id: categoryId } = await prisma.pageCategory.create({
			data: {
				name,
			},
			select: {
				id: true,
			},
		});
		for (const filename of await readDir(resolve(base, dirname))) {
			const title = parse(filename).name;
			const file = resolve(base, dirname, filename);
			const content = (await readFile(file)).toString();
			const createdAt = seedDate(wayback, today);

			console.log(`⬇️ Creating page ${title}`);
			console.log(
				`↪️ ${content
					.trim()
					.replaceAll(/\s+/g, " ")
					.replaceAll("\n", " ")
					.replaceAll(/\s+/g, " ")
					.substring(0, content.length > 80 ? 77 : 80)}${
					content.length > 80
						? ".".repeat(
								Math.max(0, Math.min(3, content.length - 80)),
						  )
						: ""
				}`,
			);

			await prisma.page.create({
				data: {
					categoryId,
					content,
					createdAt,
					title,
					updatedAt: seedDate(createdAt, today),
				},
				select: {
					id: true,
				},
			});
		}
	}
	console.log("📃 ...finished pages ✅");

	console.log(`✨ Seeding finished.`);
}

main().finally(() => {
	void (async () => {
		await prisma.$disconnect();
	})();
});
