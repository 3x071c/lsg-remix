/* eslint-disable @typescript-eslint/no-redeclare -- Zod inferred typings */
import type { PageCategory as PrismaPageCategory } from "@prisma/client";
import { z } from "zod";

export const PageCategory: z.ZodObject<{
	[K in keyof PrismaPageCategory]: z.ZodType<PrismaPageCategory[K]>;
}> = z.object({
	createdAt: z.date(),
	id: z.number(),
	name: z.string(),
	updatedAt: z.date(),
});
export type PageCategory = z.infer<typeof PageCategory>;

export const PageCategoryData = PageCategory.omit({
	createdAt: true,
	id: true,
	updatedAt: true,
});
export type PageCategoryData = z.infer<typeof PageCategoryData>;
