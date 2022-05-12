import { redirect } from "remix";
import { magicServer } from "./magic";
import {
	getSession,
	commitSession,
	destroySession,
	authorize,
	revalidate,
	safeIssuer,
} from ".";

export async function authenticate(request: Request, token: string) {
	const did = safeIssuer(token);

	const session = await revalidate(request, did);

	throw redirect("/admin", {
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
export async function invalidate(request: Request): Promise<Response> {
	const session = await getSession(request.headers.get("Cookie"));
	try {
		const user = await authorize(request, { ignore: true });
		await magicServer.users.logoutByIssuer(user.did);
	} catch (e) {}

	return redirect("/logout", {
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
 * - client
 * -- /callback
 * magic.auth.loginWithCredential() -> Completes callback
 * -- /something
 * magic.user.getMetadata() -> Gets user metadata ({email})
 * -- /logout
 * magic.user.logout() -> Invalidates session
 */
