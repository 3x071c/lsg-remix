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
 * @returns Returns all stored data or redirects to login if required (default behavior), else returns null
 */
export async function authorize<
	O extends {
		cms?: boolean;
		did?: string;
		lab?: boolean;
		schoolib?: boolean;
		required?: boolean;
		ignore?: boolean;
		lock?: boolean;
	},
>(
	request: Request,
	options?: O,
): Promise<
	[
		(
			| User
			| (O extends { required: false } ? null : Record<string, never>)
			| (O extends { ignore: true }
					? PartialExcept<User, "did" | "email">
					: Record<string, never>)
		),
		HeadersInit,
	]
> {
	const cms = options?.cms ?? false;
	const did = options?.did;
	const lab = options?.lab ?? false;
	const schoolib = options?.schoolib ?? false;
	const required = options?.required ?? true;
	const ignore = options?.ignore ?? false;
	const lock = options?.lock ?? false;
	const session = await getSession(request.headers.get("Cookie"));

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
		if (ignore)
			return [
				newUser as O extends { ignore: true }
					? PartialExcept<User, "did" | "email">
					: Record<string, never>,
				headers,
			];
		throw redirect(`/admin/users/user/${newUser.did!}`, { headers });
	}
	const user = parsedUser.data;

	if (!dbUser) throw await invalidate(request);

	if (user.locked && !lock) throw redirect("/admin/locked", { headers });

	if (
		(cms && !user.canAccessCMS) ||
		(lab && !user.canAccessLab) ||
		(schoolib && !user.canAccessSchoolib)
	)
		throw redirect("/admin", { headers });

	if (did && did !== user.did && !user.canAccessUsers)
		throw redirect(`/admin/users/user/${user.did}`, { headers });

	return [user, headers];
}
