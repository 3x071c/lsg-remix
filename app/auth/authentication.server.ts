import type { z } from "zod";
import { redirect } from "remix";
import { magicServer } from "~app/magic";
import { users, User } from "~app/models";
import { entries } from "~app/util";
import { url as logoutURL } from "~routes/__auth/logout";
import { url as onboardingURL } from "~routes/__auth/onboard";
import { url as adminURL } from "~routes/__pages/admin/index";
import { cmsAuthSessionStorage } from "./session.server";

export const UserData = User.omit({ did: true, uuid: true });
// eslint-disable-next-line @typescript-eslint/no-redeclare -- Zod TypeScript integration
export type UserData = z.infer<typeof UserData>;
export async function login(
	request: Request,
	didToken: unknown,
	data?: UserData,
) {
	if (!didToken || typeof didToken !== "string")
		throw new Error(
			"Authentifizierung aufgrund fehlendem Tokens fehlgeschlagen",
		);

	/* Get the DID of the user (in test mode during development, the token is invalid, so mock it instead) */
	let did: string | null | undefined;
	if (global.env.NODE_ENV !== "development") {
		try {
			magicServer().token.validate(
				didToken,
			); /* 🚨 Important: Make sure the token is valid and **hasn't expired**, before authorizing access to user data! */
		} catch (e) {
			throw new Error("Etwas stimmt mit ihrem Nutzer nicht");
		}

		({ issuer: did } = await magicServer().users.getMetadataByToken(
			didToken,
		));
	} else {
		did = `did:ethr:0x${"0".repeat(40)}`;
	}

	if (!did) throw new Error("Dem Nutzer fehlen erforderliche Eigenschaften");

	/* Get user UUID */
	const didRecords = await users().listValues("did");
	const uuids = didRecords.data
		.map(({ uuid, value }) => (value === did ? uuid : false))
		.filter(Boolean);
	if (uuids.length > 1) throw new Error("Mehrere Nutzer auf einem Datensatz");

	let uuid = uuids[0];
	if (!uuid) {
		const parsed = UserData.safeParse(data);
		if (!parsed.success) throw redirect(onboardingURL);
		const { firstname, lastname } = parsed.data;
		({ uuid } = await users().create({
			did,
			firstname,
			lastname,
		}));
	}

	const session = await cmsAuthSessionStorage().getSession(
		request.headers.get("Cookie"),
	);
	entries(
		User.parse({
			...(await users().getMany(uuid, ["firstname", "lastname"])),
			did,
			uuid,
		}),
	).map((e) => session.set(e![0] as string, e![1]));

	throw redirect(adminURL, {
		headers: {
			"Set-Cookie": await cmsAuthSessionStorage().commitSession(session),
		},
	});
}

/**
 * Logs the user out by purging his data
 * @param request The incoming request
 * @returns Redirects to the login
 */
export async function logout(request: Request): Promise<Response> {
	const session = await cmsAuthSessionStorage().getSession(
		request.headers.get("Cookie"),
	);

	return redirect(logoutURL, {
		headers: {
			"Set-Cookie": await cmsAuthSessionStorage().destroySession(session),
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
