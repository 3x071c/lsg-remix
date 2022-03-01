import type { User } from "@prisma/client";

type IronSessionUser = Pick<User, "id">;

declare module "iron-session" {
	interface IronSessionData {
		user?: IronSessionUser;
	}
}
