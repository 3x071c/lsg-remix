import { createCookieSessionStorage, redirect } from "remix";
import { url as cmsURL } from "~routes/cms";
import { url as loginURL } from "~routes/cms/login";

// eslint-disable-next-line prefer-destructuring -- process.env doesn't have a proper iterator
const CMS_AUTH_SECRET = process.env["CMS_AUTH_SECRET"];

if (!CMS_AUTH_SECRET) {
	throw new Error(
		"API Authorization secret is undefined, server can't handle requests at the moment.",
	);
}

const storage = createCookieSessionStorage({
	cookie: {
		httpOnly: true,
		maxAge: 604800,
		name: "cms_auth",
		path: "/",
		sameSite: process.env.NODE_ENV !== "development" ? "strict" : "none",
		secrets: [CMS_AUTH_SECRET],
		secure: process.env.NODE_ENV !== "development",
	},
});

const getSessionFromCookie = (request: Request) =>
	storage.getSession(request.headers.get("Cookie"));

type SessionData = {
	id: number;
};
const SessionDataType: { [key in keyof SessionData]: string } = {
	id: "number",
};
export async function login(
	request: Request,
	sessionData: SessionData,
): Promise<Response> {
	const session = await getSessionFromCookie(request);
	Object.entries(sessionData).map(([k, v]) => session.set(k, v));

	return redirect(cmsURL, {
		headers: { "Set-Cookie": await storage.commitSession(session) },
	});
}

export async function logout(request: Request): Promise<Response> {
	const session = await getSessionFromCookie(request);

	return redirect(loginURL, {
		headers: {
			"Set-Cookie": await storage.destroySession(session),
		},
	});
}

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

	const session = await storage.getSession(request.headers.get("Cookie"));
	if (Object.keys(session.data).length === 0) {
		if (required) throw redirect(loginURL);
		return undefined as
			| SessionData
			| (O extends { required: false }
					? undefined
					: Record<string, never>);
	}
	if (
		Object.entries(SessionDataType).some(
			([k, v]) => typeof session.get(k) !== v,
		)
	)
		throw await logout(request);

	return session.data as SessionData;
}

export function toCMS(): Response {
	return redirect(cmsURL);
}
export function toLogin(): Response {
	return redirect(loginURL);
}
