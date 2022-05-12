/* eslint-disable @typescript-eslint/no-redeclare -- Zod inferred typings */
import type { z } from "zod";
import { UserModel } from "~db";

export const User = UserModel;
export type User = z.infer<typeof User>;

export const UserData = User.omit({
	createdAt: true,
	updatedAt: true,
	uuid: true,
});
