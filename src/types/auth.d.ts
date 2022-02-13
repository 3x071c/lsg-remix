import type { User } from "@prisma/client";

declare module "iron-session" {
	interface IronSessionData {
		user?: Pick<User, "id">;
	}
}

type UserWithPermissions = User & {
	canMutatePages: CanMutatePagesOnUsers[];
	canMutateUsers: CanMutateUsersOnUsers[];
};
