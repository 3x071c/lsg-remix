import { redirect } from "remix";
import { url as loginURL } from "~routes/admin/login";
import { cmsAuthSessionStorage } from "./session.server";
/**
 * Logs the user out by purging his data
 * @param request The incoming request
 * @returns Redirects to the login
 */
export async function logout(request: Request): Promise<Response> {
	const session = await cmsAuthSessionStorage().getSession(
		request.headers.get("Cookie"),
	);

	return redirect(loginURL, {
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
