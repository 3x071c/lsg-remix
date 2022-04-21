/* eslint-disable @typescript-eslint/unbound-method */
import { createCookieSessionStorage } from "remix";

const { AUTH_SECRET } = process.env;

if (!AUTH_SECRET || typeof AUTH_SECRET !== "string") {
	throw new Error(
		"API Authorization secret is undefined, server can't handle requests at the moment.",
	);
}

/**
 * A session cookie to store insensitive data in.
 * 🚨 This is only signed, not encrypted. The client can't falsify the value, **but it can be read out!** 🚨
 */
export const { getSession, commitSession, destroySession } =
	createCookieSessionStorage({
		cookie: {
			httpOnly: true,
			maxAge: 604800,
			name: "cms_auth",
			path: "/",
			sameSite: process.env.NODE_ENV !== "development" ? "strict" : "lax",
			secrets: [AUTH_SECRET],
			secure: process.env.NODE_ENV !== "development",
		},
	});
