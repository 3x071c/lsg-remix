import { redirect } from "remix";
import superjson from "superjson";
import { User } from "~models";
import { fromEntries, keys } from "~lib/util";
import { getSession, invalidate } from ".";

/**
 * Authorize an incoming request by checking the session data and returning it
 * @param request The incoming request
 * @param options Options to modify behavior
 * @returns Returns all stored data or redirects to login if required (default behavior), else returns null
 */
export async function authorize<
	O extends {
		required?: boolean;
		ignore?: boolean;
	},
>(
	request: Request,
	options?: O,
): Promise<
	| User
	| (O extends { required: false } ? null : Record<string, never>)
	| (O extends { ignore: true }
			? PartialExcept<User, "did">
			: Record<string, never>)
> {
	const required = options?.required ?? true;
	const ignore = options?.ignore ?? false;
	const session = await getSession(request.headers.get("Cookie"));

	if (keys(session.data).length === 0) {
		if (required) throw redirect("/login");
		return null as O extends { required: false }
			? null
			: Record<string, never>;
	}
	const user = fromEntries(
		keys(User.shape)
			.map((key) => {
				const value = session.get(key) as string | null;
				if (!value) return false;
				return [key, superjson.parse<User[typeof key]>(value)] as const;
			})
			.filter(Boolean) as [PropertyKey, unknown][],
	);

	try {
		return User.parse(user);
	} catch (e) {
		if (!user["did"]) throw await invalidate(request);
		if (ignore)
			return user as O extends { ignore: true }
				? PartialExcept<User, "did">
				: Record<string, never>;
		throw redirect("/admin/user");
	}
}
