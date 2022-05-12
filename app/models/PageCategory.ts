/* eslint-disable @typescript-eslint/no-redeclare -- Zod inferred typings */
import type { z } from "zod";
import { PageCategoryModel } from "~db";

export const PageCategory = PageCategoryModel;
export type PageCategory = z.infer<typeof PageCategory>;

export const PageCategoryData = PageCategory.omit({
	createdAt: true,
	updatedAt: true,
	uuid: true,
});
