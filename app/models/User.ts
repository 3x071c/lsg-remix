/* eslint-disable @typescript-eslint/no-redeclare -- Zod inferred typings */
import type { User as PrismaUser } from "@prisma/client";
import type { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { UserModel } from "~db";

export const User: z.ZodObject<{
	[K in keyof PrismaUser]: z.ZodType<PrismaUser[K]>;
}> = UserModel;
export type User = z.infer<typeof User>;

export const UserData = User.omit({
	createdAt: true,
	updatedAt: true,
	uuid: true,
});

export const UserValidatorData = UserData.omit({
	canAccessCMS: true,
	canAccessLab: true,
	canAccessSchoolib: true,
	did: true,
	email: true,
	locked: true,
});
export const UserValidator = withZod(UserValidatorData);
