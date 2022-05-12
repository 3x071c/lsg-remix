import type { Session } from "remix";
import superjson from "superjson";
import { User } from "~models";
import { prisma } from "~lib/prisma";
import { entries } from "~lib/util";
import { getSession, safeMetadata } from ".";

export async function revalidate(
	request: Request,
	did: User["did"],
): Promise<[PartialExcept<User, "did" | "email">, Session]> {
	/* Validate the DID */
	const rawDID = User.shape.did.safeParse(did);
	if (!rawDID.success)
		throw new Error(
			"Nutzeridentifikation wurden nicht korrekt übermittelt",
		);

	/* Revalidate user data via Magic */
	const { email } = await safeMetadata(rawDID.data);
	if (!(did && email))
		throw new Error(
			"Der Nutzer wurde nicht erfolgreich bei Magic angelegt",
		);

	/* Get database user data to save in the session, if any */
	const user = (await prisma.user.findUnique({
		where: {
			did,
		},
	})) || { did, email };

	/* Overwrite database user data with Magic user data, if there are discrepancies */
	if (user.email !== email)
		await prisma.user.update({
			data: { email },
			select: { uuid: true },
			where: { did },
		});

	/* Squeeze it all into a cookie (🚨 WARNING: The cookie is only signed, not encrypted. The client can technically read all the values. Exclude properties if in doubt.) */
	const session = await getSession(request.headers.get("Cookie"));
	entries(user).map(([k, v]) => session.set(k, superjson.stringify(v)));

	return [user, session];
}
