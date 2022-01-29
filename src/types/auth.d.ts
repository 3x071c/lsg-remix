import type {
	Permission,
	User,
	PermissionsOnUsers,
	PagesOnUsers,
} from "@prisma/client";

/*
The UserWithRelations must contain the id, all other attributes
all optional
Have a look at the comment in /pages/api/index.ts to understand
why it is like this
*/
type UserWithRelations = {
	id: number;
	short?: string;
	name?: string;
	password?: string;
	pages?: (PagesOnUsers & {
		page: Page;
	})[];
	permissions?: (PermissionsOnUsers & {
		assignedBy: User;
		permission: Permission;
	})[];
	permissionsAssigned?: (PermissionsOnUsers & {
		user: User;
		permission: Permission;
	})[];
};
declare module "iron-session" {
	interface IronSessionData {
		user?: UserWithRelations;
	}
}
