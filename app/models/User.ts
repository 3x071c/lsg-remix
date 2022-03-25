/* eslint-disable @typescript-eslint/no-redeclare -- Make Zod typings usable */
/* eslint-disable no-underscore-dangle -- Private APIs */
import { z } from "zod";
import handler from "./_handler";
import { Email, Firstname, Lastname, Password, UUID } from "./_shared";

const rawUser = {
	email: Email,
	firstname: Firstname,
	lastname: Lastname,
	password: Password,
	uuid: UUID,
};
export const User = z.object(rawUser);
export type User = z.infer<typeof User>;

export const users = handler<User, typeof rawUser>("users", "Nutzer", User);
