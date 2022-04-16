/* eslint-disable @typescript-eslint/no-redeclare -- Zod inferred typings */
import type { Page as PrismaPage } from "@prisma/client";
import { z } from "zod";

export const Page: z.ZodObject<{
	[K in keyof PrismaPage]: z.ZodType<PrismaPage[K]>;
}> = z.object({
	categoryId: z.number(),
	content: z.string(),
	createdAt: z.date(),
	id: z.number(),
	title: z.string(),
	updatedAt: z.date(),
});
export type Page = z.infer<typeof Page>;

export const PageData = Page.omit({
	createdAt: true,
	id: true,
	updatedAt: true,
});
export type PageData = z.infer<typeof PageData>;
