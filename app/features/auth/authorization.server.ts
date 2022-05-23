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
		/** (DANGER!) Bypass redirects, e.g. for layout routes to not redirect when visiting child routes which might have a different set of access restrictions (currently implies `{ ignore: true, lock: true }`) */
		bypass?: boolean;
		/** Restrict access on CMS pages */
		cms?: boolean;
		/** Restrict access by access to DID */
		did?: string;
		/** Restrict access on Event pages */
		events?: boolean;
		/** (DANGER!) Ignore missing user properties (don't redirect to the user configuration) */
		ignore?: boolean;
		/** Restrict access on Admin Lab pages */
		lab?: boolean;
		/** Restrict access on lock pages (pages the user is allowed to visit when locked) */
		lock?: boolean;
		/** (DANGER!) Don't throw if the user isn't signed in (f.e. to provide additional functionality for authenticated users, without requiring it), when required=false */
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
	const bypass = options?.bypass ?? false;
	const cms = options?.cms ?? false;
	const did = options?.did;
	const events = options?.events ?? false;
	const ignore = options?.ignore ?? false;
	const lab = options?.lab ?? false;
	const lock = options?.lock ?? false;
	const required = options?.required ?? true;
	const schoolib = options?.schoolib ?? false;
	const ticker = options?.ticker ?? false;

	/* Unauthenticated check */
	if (keys(session.data).length === 0) {
		if (required) throw redirect("/login");
		return [
			null as O extends { required: false }
				? null
				: Record<string, never>,
			{},
		];
	}

	/* Get all available user data from the session */
	const sessionUser = fromEntries(
		keys(User.shape)
			.map((key) => {
				const value = session.get(key) as string | null;
				if (!value) return false;
				return [key, superjson.parse<User[typeof key]>(value)] as const;
			})
			.filter(Boolean) as [PropertyKey, unknown][],
	) as Partial<User>; /* at this point, there's a signed user object in the session cookie, so he must be authenticated. However, it is unknown what data has been stored, as it may be significantly outdated or incomplete since creation (new and recurring users might be missing properties) */

	/* The DID is essential to identifying the user. If it is missing (who knows why), we must consider the session unauthorized and invalidate it to get the user to log in again with a valid DID. */
	if (!sessionUser.did) throw await invalidate(request);

	/* We only need to know when the user was last updated in the database to determine if the session is out of date and has to be revalidated/recreated */
	const dbUser = await prisma.user.findUnique({
		select: { updatedAt: true },
		where: { did: sessionUser.did },
	}); /* We can't destructure here because the user might be null. We could do a null check here and redirect to the user settings screen, however we'd have to implementing the same redirection logic again later for incomplete users (f.e. because a database migration has left the user account with missing data) anyway, so let's handle it all in one place downstream. (*deduplication* yay) */

	/* If the database user's `updatedAt` isn't equal to the session's `updatedAt`, there were updates to the user record that haven't been copied to the session yet -> revalidate */
	const [newUser, newSession] =
		(sessionUser.updatedAt?.getTime() ?? null) !==
			(dbUser?.updatedAt?.getTime() ?? null) ||
		!sessionUser.email /* Also revalidate if the email is missing in the session data, as this will fetch it via the known DID from Magic directly */
			? await revalidate(request, sessionUser.did)
			: [sessionUser, null];
	/* The authorization function returns a tuple with headers in the second field that are to be passed to the final `Response`. This is because in the case of revalidation the cookie has to be updated, which can only be done via a new `Set-Cookie` HTTP header. Else we'd have to run expensive server-side logic for every request. */
	const headers = newSession
		? {
				"Set-Cookie": await commitSession(newSession),
		  }
		: ({} as Record<string, never>);

	/* Now, validate the user to check if any properties are missing */
	const parsedUser = User.safeParse(newUser);
	if (!parsedUser.success) {
		/* Apart from the user's DID and E-Mail, we don't know exactly which properties are missing. Redirect to the user settings page, and pass on everything we've got to there. */
		if (ignore || bypass)
			return [
				newUser as O extends { ignore: true } | { bypass: true }
					? PartialExcept<User, "did" | "email">
					: Record<string, never>,
				headers,
			];
		throw redirect(`/admin/users/user/${newUser.did!}`, { headers });
	}
	const user =
		parsedUser.data; /* At last, we can now be sure the user is complete and fully authenticated. */

	/* If for whatever reason there are no user records in the database, invalidate the session immediately as it is invalid. We couldn't do this earlier because we first had to rule out the possibility that the user is new and therefore needs to be directed to the setup/settings/configuration page instead. */
	if (!dbUser) throw await invalidate(request);

	/* Upcoming: A bunch of one-liners to make sure the user has the necessary privileges to authorize the request. */

	if (user.locked && !lock && !bypass)
		/* The user is locked, redirect to the locked page */
		throw redirect("/admin/locked", { headers });

	if (
		(cms && !user.canAccessCMS) ||
		(events && !user.canAccessEvents) ||
		(lab && !user.canAccessLab) ||
		(schoolib && !user.canAccessSchoolib) ||
		(ticker && !user.canAccessTicker)
	)
		/* The user is missing permissions to access the requested admin sub-page, redirect to the admin landing */
		throw redirect("/admin", { headers });

	if (did && did !== user.did && !user.canAccessUsers)
		/* The user isn't allowed to access the configuration of whoever is identified by $did, redirect to his own settings */
		throw redirect(`/admin/users/user/${user.did}`, { headers });

	/* All good! 🎉 */
	return [user, headers];
}
