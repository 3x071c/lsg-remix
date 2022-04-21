/* eslint-disable @typescript-eslint/no-redeclare -- Zod inferred typings */
import type { User as PrismaUser } from "@prisma/client";
import type { z } from "zod";
import { UserModel } from "~models";

export const User: z.ZodObject<{
	[K in keyof PrismaUser]: z.ZodType<PrismaUser[K]>;
}> = UserModel;
export type User = z.infer<typeof User>;
