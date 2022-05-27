/* eslint-disable @typescript-eslint/no-redeclare -- Zod inferred typings */
import type { z } from "zod";
import { MagicUserModel } from "~db";

export const MagicUser = MagicUserModel;
export type MagicUser = z.infer<typeof MagicUser>;

export const MagicUserData = MagicUser.omit({
	createdAt: true,
	updatedAt: true,
	uuid: true,
});
