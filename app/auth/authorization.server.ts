import { redirect } from "remix";
import { z } from "zod";
import { url as cmsURL } from "~routes/cms";
import { url as loginURL } from "~routes/cms/login";
import sessionStorage from "./session.server";

/* Little function to avoid repetition */
const getSessionFromStorage = (request: Request) =>
	sessionStorage.getSession(request.headers.get("Cookie"));

export const SessionData = z.object({
	uuid: z.string(),
});
// eslint-disable-next-line @typescript-eslint/no-redeclare -- The type of SessionData by itself is unusable in TS
export type SessionData = z.infer<typeof SessionData>;

/**
 * Logs the user in by storing his data
 * @param request The incoming request
 * @param sessionData Session data to store
 * @returns Redirects to the CMS
 * @throws Validation error
 */
export async function login(
	request: Request,
	sessionData: SessionData,
): Promise<Response> {
	const session = await getSessionFromStorage(request);
	Object.entries(SessionData.parse(sessionData)).map(([k, v]) =>
		session.set(k, v),
	);

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
	const session = await getSessionFromStorage(request);

	return redirect(loginURL, {
		headers: {
			"Set-Cookie": await sessionStorage.destroySession(session),
		},
	});
}

/**
 * Authorize an incoming request by checking the session data and returning it
 * @param request The incoming request
 * @param options Options to modify behavior
 * @returns Returns all stored data or redirects to login if required (default behavior), else returns undefined
 */
export async function authorize<
	O extends {
		required?: boolean;
	},
>(
	request: Request,
	options?: O,
): Promise<
	| SessionData
	| (O extends { required: false } ? undefined : Record<string, never>)
> {
	const required = options?.required ?? true;
	const session = await getSessionFromStorage(request);

	if (Object.keys(session.data).length === 0) {
		if (required) throw redirect(loginURL);
		return undefined as
			| SessionData
			| (O extends { required: false }
					? undefined
					: Record<string, never>);
	}
	if (!SessionData.safeParse(session.data).success)
		throw await logout(request);

	return session.data as SessionData;
}

/**
 * Redirects to the CMS homepage
 * @returns Redirects to the CMS URL
 */
export function toCMS(): Response {
	return redirect(cmsURL);
}
/**
 * Redirects to the Login page
 * @returns Redirects to the Login URL
 */
export function toLogin(): Response {
	return redirect(loginURL);
}
