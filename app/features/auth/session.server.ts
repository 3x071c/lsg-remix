/* eslint-disable @typescript-eslint/unbound-method */
import type { z } from "zod";
import { createCookieSessionStorage } from "remix";
import { MagicUser, User } from "~models";
import { denullishShape } from "~lib/util";

const { AUTH_SECRET } = process.env;

if (!AUTH_SECRET || typeof AUTH_SECRET !== "string") {
	throw new Response(
		"API Authorization secret is undefined, server can't handle requests at the moment.",
		{ status: 500, statusText: "Internes Problem" },
	);
}

/**
 * A session cookie to store insensitive data in (-> See the SessionData type)
 * 🚨 This is only signed, not encrypted. The client can't falsify the value, **but it can be read out!** 🚨
 */
export const { getSession, commitSession, destroySession } =
	createCookieSessionStorage({
		cookie: {
			httpOnly: true,
			maxAge: 604800,
			name: "USER_SESSION",
			path: "/",
			sameSite: process.env.NODE_ENV !== "development" ? "strict" : "lax",
			secrets: [AUTH_SECRET],
			secure: process.env.NODE_ENV !== "development",
		},
	});

export const SessionData = User.merge(
	denullishShape(
		// Hacky fix to get rid of the zod nullable type
		MagicUser.pick({
			did: true /* Add the DID to pass it along in case the User is empty/doesn't exist yet */,
			email: true,
			phoneNumber: true,
		}),
	),
);
// eslint-disable-next-line @typescript-eslint/no-redeclare -- Zod inferred typings
export type SessionData = z.infer<typeof SessionData>;
