import type { Prisma } from "@prisma/client";

declare module "iron-session" {
	interface IronSessionData {
		user?: Prisma.UserSelect;
	}
}
