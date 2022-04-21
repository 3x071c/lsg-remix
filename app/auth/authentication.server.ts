import type { UserData } from "~app/models";
import { redirect } from "remix";
import superjson from "superjson";
import { magicServer } from "~app/magic";
import { PrismaClient as prisma } from "~app/prisma";
import { entries } from "~app/util";
import { url as logoutURL } from "~routes/__auth/logout";
import { url as onboardingURL } from "~routes/__auth/onboard";
import { url as adminURL } from "~routes/__pages/admin/index";
import { getSession, commitSession, destroySession } from "./session.server";

const development = process.env.NODE_ENV === "development";

export async function login(
	request: Request,
	didToken: unknown,
	data?: UserData,
) {
	if (!didToken || typeof didToken !== "string")
		throw new Error(
			"Authentifizierung aufgrund fehlendem Tokens fehlgeschlagen",
		);

	/* Magic Test Mode in development produces invalid tokens, so skip this step */
	if (!development) {
		try {
			magicServer.token.validate(
				didToken,
			); /* 🚨 Important: Make sure the token is valid and **hasn't expired**, before authorizing access to user data! */
		} catch (e) {
			throw new Error("Die Anmeldung ist fehlgeschlagen");
		}
	}

	/* Get the DID (and other Magic info) of the user (in test mode during development, the token is invalid, so mock it instead) */
	const { issuer: did, email } = development
		? { email: "test@magic.link", issuer: `did:ethr:0x${"0".repeat(40)}` }
		: await magicServer.users.getMetadataByToken(didToken);

	if (!did || !email)
		throw new Error(
			"Es wurden nicht alle erforderlichen Daten gesichert und übermittelt",
		);

	/* Get all user data to save in the session, or create a new one (by onboarding) if the user is new */
	const user =
		(await prisma.user.findUnique({
			where: {
				did,
			},
		})) ||
		(await (() => {
			if (!data) throw redirect(onboardingURL);
			return prisma.user.create({
				data: {
					...data,
					did,
					email,
				},
			});
		})());

	const session = await getSession(request.headers.get("Cookie"));
	entries(user).map(([k, v]) => session.set(k, superjson.stringify(v)));

	throw redirect(adminURL, {
		headers: {
			"Set-Cookie": await commitSession(session),
		},
	});
}

/**
 * Logs the user out by purging his data
 * @param request The incoming request
 * @returns Redirects to the login
 */
export async function logout(request: Request): Promise<Response> {
	const session = await getSession(request.headers.get("Cookie"));

	return redirect(logoutURL, {
		headers: {
			"Set-Cookie": await destroySession(session),
		},
	});
}

/**
 * MAGIC FLOW:
 * - client login:
 * -- /login
 * magic.user.isLoggedIn() -> Indicator
 * didToken = magic.auth.loginWithMagicLink({ email, redirectURI }) -> Sends the magic mail
 * - server api validation:
 * didToken = magic.utils.parseAuthorizationHeader(req.headers.authorization) -> from auth bearer header
 * magic.token.validate(didToken) -> Validate token
 * const user = await magic.users.getMetadataByToken(did) -> Get user metadata ({email})
 * setCookie() -> Sets user data as httpOnly/secure cookie
 * -- /callback
 * magic.auth.loginWithCredential() -> Completes callback
 * - client
 * magic.user.getMetadata() -> Gets user metadata ({email})
 * -- /logout
 * magic.user.logout() -> Invalidates session
 */
