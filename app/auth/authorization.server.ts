import { redirect } from "remix";
import { User } from "~app/models";
import { fromEntries } from "~app/util";
import { url as loginURL } from "~routes/cms/login";
// import { logout } from "./authentication.server";
import { sessionStorage } from "./session.server";

/**
 * Authorize an incoming request by checking the session data and returning it
 * @param request The incoming request
 * @param options Options to modify behavior
 * @returns Returns all stored data or redirects to login if required (default behavior), else returns undefined
 */
export async function authorize<
	O extends {
		required?: boolean;
	},
>(
	request: Request,
	options?: O,
): Promise<
	User | (O extends { required: false } ? undefined : Record<string, never>)
> {
	const required = options?.required ?? true;
	const session = await sessionStorage.getSession(
		request.headers.get("Cookie"),
	);

	if (Object.keys(session.data).length === 0) {
		if (required) throw redirect(loginURL);
		return undefined as
			| User
			| (O extends { required: false }
					? undefined
					: Record<string, never>);
	}
	const user = fromEntries<User>(
		Object.keys(User.shape).map((key) => [
			key as keyof User,
			session.get(key),
		]),
	);
	if (!User.safeParse(user).success) throw redirect("/");

	return session.data as User;
}
