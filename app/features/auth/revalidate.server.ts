import type { Session } from "remix";
import superjson from "superjson";
import { prisma } from "~lib/prisma";
import { entries } from "~lib/util";
import { getSession, SessionData } from ".";

export async function revalidate(
	request: Request,
	did: SessionData["did"],
): Promise<[PartialExcept<SessionData, "did">, Session]> {
	const session = await getSession(request.headers.get("Cookie"));

	/* Validate the required SessionData identifier */
	const sessionData = SessionData.shape.did.safeParse(did);
	if (!sessionData.success)
		throw new Response("Nutzer konnte nicht identifiziert werden", {
			status: 400,
			statusText: "Schlechte Anfrage",
		});

	/* Revalidate from the database, if possible */
	const user: Pick<SessionData, "did"> = {
		/* Why Pick over PartialExcept here you may ask? Because TS STILL IS A PITA TO WORK WITH */
		did,
		...(
			await prisma.magicUser.findUnique({
				select: {
					user: true,
				},
				where: {
					did,
				},
			})
		)?.user,
	}; /* This might be of type SESSIONDATA, or missing properties of model USER because the database record doesn't exist yet */

	/* Squeeze all we have into a cookie (🚨 WARNING: The cookie is only signed, not encrypted. The client can technically read all the values. Exclude properties if in doubt.) */
	entries(user).map(([k, v]) => session.set(k, superjson.stringify(v)));

	return [user, session];
}
