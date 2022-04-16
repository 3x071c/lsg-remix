import { redirect } from "remix";
import { User } from "~app/models";
import { fromEntries, keys } from "~app/util";
import { url as loginURL } from "~routes/__auth/login";
import { url as logoutURL } from "~routes/__auth/logout";
import { getSession } from "./session.server";

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
	const session = await getSession(request.headers.get("Cookie"));

	if (keys(session.data).length === 0) {
		if (required) throw redirect(loginURL);
		return undefined as O extends { required: false }
			? undefined
			: Record<string, never>;
	}
	const user = fromEntries(
		keys(User.shape).map(
			(key) => [key, session.get(key) as User[typeof key]] as const,
		),
	);

	try {
		return User.parse(user);
	} catch (e) {
		throw redirect(logoutURL);
	}
}
