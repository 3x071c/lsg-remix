/* eslint-disable @typescript-eslint/no-redeclare -- Make Zod typings usable */

import { z } from "zod";
import handler from "./_handler";
import {
	Firstname,
	Lastname,
	DID,
	UUID,
	ImageDelivery,
	DateType,
} from "./_shared";

export const User = z.object({
	avatar: ImageDelivery,
	createdAt: DateType,
	did: DID,
	editedAt: DateType,
	firstname: Firstname,
	lastname: Lastname,
	uuid: UUID,
});
export type User = z.infer<typeof User>;
export const UserData = User.omit({
	avatar: true,
	createdAt: true,
	did: true,
	editedAt: true,
	uuid: true,
});
export type UserData = z.infer<typeof UserData>;
export const UserID = User.pick({ did: true, uuid: true });
export type UserID = z.infer<typeof UserID>;

export const users = handler<User, typeof User["shape"], typeof User>(
	User,
	"users",
	"Nutzer",
);
