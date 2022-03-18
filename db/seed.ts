/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

/* eslint-disable no-console */

import { readdir as readDir, readFile, stat } from "fs/promises";
import { parse, resolve } from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function main(): Promise<void> {
	console.log(`Start seeding ✨`);

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
			const { birthtime: createdAt, mtime: updatedAt } = await stat(file);

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
					updatedAt,
				},
				select: {
					id: true,
				},
			});
		}
	}

	console.log(`✨ Seeding finished.`);
}

main().finally(() => {
	void (async () => {
		await prisma.$disconnect();
	})();
});
