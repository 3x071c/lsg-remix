import { redirect } from "remix";
import superjson from "superjson";
import { User } from "~models";
import { fromEntries, keys } from "~lib/util";
import { getSession } from "./session.server";
import { logout } from ".";

/**
 * Authorize an incoming request by checking the session data and returning it
 * @param request The incoming request
 * @param options Options to modify behavior
 * @returns Returns all stored data or redirects to login if required (default behavior), else returns undefined
 */
export async function authorize<
	O extends {
		required?: boolean;
		onboarding?: boolean;
	},
>(
	request: Request,
	options?: O,
): Promise<
	| User
	| (O extends { required: false } | { onboarding: true }
			? undefined
			: Record<string, never>)
> {
	const required = options?.required ?? true;
	const onboarding = options?.onboarding ?? false;
	const session = await getSession(request.headers.get("Cookie"));

	if (keys(session.data).length === 0) {
		if (required) throw redirect("/login");
		return undefined as O extends { required: false } | { onboarding: true }
			? undefined
			: Record<string, never>;
	}
	const user = fromEntries(
		keys(User.shape)
			.map((key) => {
				const value = session.get(key) as string | undefined;
				if (!value) return false;
				return [key, superjson.parse<User[typeof key]>(value)] as const;
			})
			.filter(Boolean) as [PropertyKey, unknown][],
	);

	try {
		return User.parse(user);
	} catch (e) {
		if (onboarding)
			return undefined as O extends
				| { required: false }
				| { onboarding: true }
				? undefined
				: Record<string, never>;
		throw await logout(request);
	}
}
