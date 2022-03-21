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

const getCookies = (request: Request) => request.headers.get("Cookie");

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
	const session = await storage.getSession(getCookies(request));
	Object.entries(sessionData).map(([k, v]) => session.set(k, v));
	return redirect(cmsURL, {
		headers: { "Set-Cookie": await storage.commitSession(session) },
	});
}

export async function logout(request: Request): Promise<Response> {
	const session = await storage.getSession(getCookies(request));
	return redirect(loginURL, {
		headers: {
			"Set-Cookie": await storage.destroySession(session),
		},
	});
}

export async function authorize(
	request: Request,
	options?: { required?: boolean },
): Promise<SessionData | undefined> {
	const session = await storage.getSession(request.headers.get("Cookie"));
	if (!session.data) {
		if (options?.required) throw redirect(loginURL);
		return undefined;
	}
	Object.entries(SessionDataType).forEach(([k, v]) => {
		if (typeof session.get(k) !== v) throw logout(request);
	});
	return session.data as SessionData;
}

export function back(): Response {
	return redirect(cmsURL);
}
