import { redirect } from "remix";
import superjson from "superjson";
import { User } from "~models";
import { prisma } from "~lib/prisma";
import { fromEntries, keys } from "~lib/util";
import { getSession, invalidate, revalidate, commitSession } from ".";

/**
 * Authorize an incoming request by checking the session data and returning it
 * @param request The incoming request
 * @param options Options to modify behavior
 * @returns Returns a tuple with index [0]: user data as requested or null, [1] headers to pass down to the final response
 */
export async function authorize<
	O extends {
		/** Restrict access on CMS pages */
		cms?: boolean;
		/** Restrict access by access to DID */
		did?: string;
		/** Ignore missing user properties (don't redirect to the user configuration) */
		ignore?: boolean;
		/** Restrict access on Admin Lab pages */
		lab?: boolean;
		/** Bypass all (not required) redirects, e.g. for layout routes to not redirect when visiting child routes which might have a different set of access restrictions (currently implies `{ ignore: true, lock: true }`) */
		bypass?: boolean;
		/** Restrict access on lock pages (pages the user is allowed to visit when locked) */
		lock?: boolean;
		/** Don't throw if the user isn't signed in (f.e. to provide additional functionality for authenticated users, without requiring it), when required=false */
		required?: boolean;
		/** Restrict access on Schoolib pages */
		schoolib?: boolean;
		/** Restrict access on Ticker pages */
		ticker?: boolean;
	},
>(
	request: Request,
	options?: O,
): Promise<
	[
		(
			| User
			| (O extends { required: false } ? null : Record<string, never>)
			| (O extends { ignore: true } | { bypass: true }
					? PartialExcept<User, "did" | "email">
					: Record<string, never>)
		),
		HeadersInit,
	]
> {
	const session = await getSession(request.headers.get("Cookie"));
	const cms = options?.cms ?? false;
	const did = options?.did;
	const ignore = options?.ignore ?? false;
	const lab = options?.lab ?? false;
	const bypass = options?.bypass ?? false;
	const lock = options?.lock ?? false;
	const required = options?.required ?? true;
	const schoolib = options?.schoolib ?? false;
	const ticker = options?.ticker ?? false;

	if (keys(session.data).length === 0) {
		if (required) throw redirect("/login");
		return [
			null as O extends { required: false }
				? null
				: Record<string, never>,
			{},
		];
	}
	const partialUser = fromEntries(
		keys(User.shape)
			.map((key) => {
				const value = session.get(key) as string | null;
				if (!value) return false;
				return [key, superjson.parse<User[typeof key]>(value)] as const;
			})
			.filter(Boolean) as [PropertyKey, unknown][],
	) as Partial<User>;

	if (!partialUser.did || !partialUser.email) throw await invalidate(request);

	const dbUser = await prisma.user.findUnique({
		select: { updatedAt: true },
		where: { did: partialUser.did },
	});

	const [newUser, newSession] =
		(partialUser.updatedAt?.getTime() ?? null) !==
		(dbUser?.updatedAt?.getTime() ?? null)
			? await revalidate(request, partialUser.did)
			: [partialUser, null];
	const headers = newSession
		? {
				"Set-Cookie": await commitSession(newSession),
		  }
		: ({} as Record<string, never>);

	const parsedUser = User.safeParse(newUser);
	if (!parsedUser.success) {
		if (ignore || bypass)
			return [
				newUser as O extends { ignore: true } | { bypass: true }
					? PartialExcept<User, "did" | "email">
					: Record<string, never>,
				headers,
			];
		throw redirect(`/admin/users/user/${newUser.did!}`, { headers });
	}
	const user = parsedUser.data;

	if (!dbUser) throw await invalidate(request);

	if (user.locked && !lock && !bypass)
		throw redirect("/admin/locked", { headers });

	if (
		(cms && !user.canAccessCMS) ||
		(lab && !user.canAccessLab) ||
		(schoolib && !user.canAccessSchoolib) ||
		(ticker && !user.canAccessTicker)
	)
		throw redirect("/admin", { headers });

	if (did && did !== user.did && !user.canAccessUsers)
		throw redirect(`/admin/users/user/${user.did}`, { headers });

	return [user, headers];
}
