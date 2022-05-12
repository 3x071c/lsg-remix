/* eslint-disable @typescript-eslint/no-redeclare -- Zod inferred typings */
import type { z } from "zod";
import { PageModel } from "~db";

export const Page = PageModel;
export type Page = z.infer<typeof Page>;

export const PageData = Page.omit({
	createdAt: true,
	updatedAt: true,
	uuid: true,
});
