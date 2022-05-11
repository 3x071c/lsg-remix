/* eslint-disable @typescript-eslint/no-redeclare -- Zod inferred typings */
import type { PageCategory as PrismaPageCategory } from "@prisma/client";
import type { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { PageCategoryModel } from "~db";

export const PageCategory: z.ZodObject<{
	[K in keyof PrismaPageCategory]: z.ZodType<PrismaPageCategory[K]>;
}> = PageCategoryModel;
export type PageCategory = z.infer<typeof PageCategory>;

export const PageCategoryData = PageCategory.omit({
	createdAt: true,
	updatedAt: true,
	uuid: true,
});

export const PageCategoryValidatorData = PageCategoryData.omit({});
export const PageCategoryValidator = withZod(PageCategoryValidatorData);
