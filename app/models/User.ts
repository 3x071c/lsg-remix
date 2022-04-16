/* eslint-disable @typescript-eslint/no-redeclare -- Zod inferred typings */
import type { User as PrismaUser } from "@prisma/client";
import { z } from "zod";

export const User: z.ZodObject<{
	[K in keyof PrismaUser]: z.ZodType<PrismaUser[K]>;
}> = z.object({
	createdAt: z.date(),
	did: z.string(),
	email: z.string(),
	firstname: z.string(),
	id: z.number(),
	lastname: z.string(),
	updatedAt: z.date(),
});
export type User = z.infer<typeof User>;

export const UserData = User.omit({
	createdAt: true,
	did: true,
	email: true,
	id: true,
	updatedAt: true,
});
export type UserData = z.infer<typeof UserData>;
