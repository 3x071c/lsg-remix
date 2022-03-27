import { redirect } from "remix";
import { magicServer } from "~app/magic";
import { users, User } from "~app/models";
import { entries } from "~app/util";
import { url as cmsURL } from "~routes/cms";
import { url as loginURL } from "~routes/cms/login";
import { sessionStorage } from "./session.server";

/**
 * Authenticates the user (logging him in). Verify authentication using `authorize()`
 * @param request The incoming request
 * @param env The KV database context environment
 */
export async function authenticate(
	request: Request,
	env: AppLoadContextEnvType,
) {
	const authorizationHeader = request.headers.get("Authorization");
	if (!authorizationHeader) throw new Error("Autorisation nicht gegeben");
	const didToken = magicServer.utils.parseAuthorizationHeader(
		request.headers.get("authorization") ?? "",
	);
	if (!didToken) throw new Error("Token nicht gefunden");
	magicServer.token.validate(
		didToken,
	); /* 🚨 Important: Make sure the token is valid and **hasn't expired**, before authorizing access to user data! */
	const { issuer: did } = await magicServer.users.getMetadataByToken(
		didToken,
	);
	/* Get user UUID */
	const userEnv = users(env);
	const uuids = (await userEnv.listValues("did")).data
		.map(({ uuid, value }) => (value === did ? uuid : false))
		.filter(Boolean);
	if (uuids.length > 1) throw new Error("Mehrere Nutzer auf einem Datensatz");
	if (uuids.length === 0) throw new Error("Nutzer nicht gefunden");
	const uuid = uuids[0] as string;

	const session = await sessionStorage.getSession(
		request.headers.get("Cookie"),
	);
	entries(
		User.parse(await userEnv.getMany(uuid, ["firstname", "lastname"])),
	).map(([k, v]) => session.set(k, v));

	return redirect(cmsURL, {
		headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
	});
}

/**
 * Logs the user out by purging his data
 * @param request The incoming request
 * @returns Redirects to the login
 */
export async function logout(request: Request): Promise<Response> {
	const session = await sessionStorage.getSession(
		request.headers.get("Cookie"),
	);

	return redirect(loginURL, {
		headers: {
			"Set-Cookie": await sessionStorage.destroySession(session),
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
