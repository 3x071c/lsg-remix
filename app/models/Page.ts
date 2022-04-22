/* eslint-disable @typescript-eslint/no-redeclare -- Zod inferred typings */
import type { Page as PrismaPage } from "@prisma/client";
import type { z } from "zod";
import { PageModel } from "~db";

export const Page: z.ZodObject<{
	[K in keyof PrismaPage]: z.ZodType<PrismaPage[K]>;
}> = PageModel;
export type Page = z.infer<typeof Page>;
