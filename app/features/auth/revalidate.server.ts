import superjson from "superjson";
import type { User } from "~models";
import { prisma } from "~lib/prisma";
import { entries } from "~lib/util";
import { authorize, invalidate, getSession, safeMetadata } from ".";

const revalidateByDID = async (_did: User["did"]) => {
	const { issuer: did, email } = await safeMetadata(_did);
	if (!(did && email))
		throw new Error(
			"Es wurden nicht alle erforderlichen Daten gesichert und übermittelt",
		);

	return { did, email };
};

export async function revalidateFromSession(request: Request) {
	const user = await authorize(request, { ignore: true });
	if (!user.did) throw await invalidate(request);

	return revalidateByDID(user.did);
}

export async function revalidateToSession(request: Request, _did: User["did"]) {
	const { did, email } = await revalidateByDID(_did);

	/* Get all user data to save in the session, if any */
	const user = (await prisma.user.findUnique({
		where: {
			did,
		},
	})) || { did, email };

	/* Sync the User email to the one stored with Magic */
	if (user.email !== email)
		await prisma.user.update({
			data: { email },
			select: { uuid: true },
			where: { did },
		});

	/* Squeeze it all into a cookie (🚨 WARNING: The cookie is only signed, not encrypted. The client can technically read all the values. Exclude properties if in doubt.) */
	const session = await getSession(request.headers.get("Cookie"));
	entries(user).map(([k, v]) => session.set(k, superjson.stringify(v)));

	return session;
}
