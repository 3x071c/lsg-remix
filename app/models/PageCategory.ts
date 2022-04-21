/* eslint-disable @typescript-eslint/no-redeclare -- Zod inferred typings */
import type { PageCategory as PrismaPageCategory } from "@prisma/client";
import type { z } from "zod";
import { PageCategoryModel } from "~models";

export const PageCategory: z.ZodObject<{
	[K in keyof PrismaPageCategory]: z.ZodType<PrismaPageCategory[K]>;
}> = PageCategoryModel;
export type PageCategory = z.infer<typeof PageCategory>;
