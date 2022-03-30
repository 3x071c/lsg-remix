/* eslint-disable @typescript-eslint/no-redeclare -- Make Zod typings usable */

import { z } from "zod";
import handler from "./_handler";
import { Firstname, Lastname, DID, UUID } from "./_shared";

const rawUser = {
	did: DID,
	firstname: Firstname,
	lastname: Lastname,
	uuid: UUID,
};
export const User = z.object(rawUser);
export type User = z.infer<typeof User>;

export const users = handler<User, typeof rawUser>("users", "Nutzer", User);
