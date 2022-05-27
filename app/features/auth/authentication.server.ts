import { redirect } from "remix";
import { magicServer } from "./magic";
import {
	getSession,
	destroySession,
	revalidate,
	safeIssuer,
	authorize,
	commitSession,
} from ".";

export async function authenticate(request: Request, token: string) {
	const did = safeIssuer(token);

	const [user, session] = await revalidate(request, did);

	/* The user has successfully authenticated with the server, log the client back out */
	try {
		await magicServer.users.logoutByIssuer(user.did);
	} catch (e) {}

	throw redirect("/admin", {
		headers: {
			"Set-Cookie": await commitSession(session),
		},
	});
}

/**
 * Logs the user out by returning a Response that destroys the session
 * @param request The incoming request
 * @returns A response that has the appropriate headers set, or redirects to login
 */
export async function invalidate(request: Request): Promise<Response> {
	const session = await getSession(request.headers.get("Cookie"));

	await authorize(request, {
		/* Don't need any user info, nor do we need revalidated headers as we're going to destroy the session anyway. Just make sure that a user is actually signed in. */
		bypass: true,
	});

	return redirect("/", {
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
