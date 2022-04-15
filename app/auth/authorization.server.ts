import { redirect } from "remix";
import { UserID } from "~app/models";
import { fromEntries } from "~app/util";
import { url as loginURL } from "~routes/__auth/login";
import { url as logoutURL } from "~routes/__auth/logout";
import { cmsAuthSessionStorage } from "./session.server";

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
	UserID | (O extends { required: false } ? undefined : Record<string, never>)
> {
	const required = options?.required ?? true;
	const session = await cmsAuthSessionStorage().getSession(
		request.headers.get("Cookie"),
	);

	if (Object.keys(session.data).length === 0) {
		if (required) throw redirect(loginURL);
		return undefined as
			| UserID
			| (O extends { required: false }
					? undefined
					: Record<string, never>);
	}
	const userID = fromEntries(
		Object.keys(UserID.shape).map(
			(key) => [key as keyof UserID, session.get(key)] as const,
		),
	);

	try {
		return UserID.parse(userID);
	} catch (e) {
		throw redirect(logoutURL);
	}
}
