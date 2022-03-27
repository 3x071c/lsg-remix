import { createCookieSessionStorage } from "remix";

// eslint-disable-next-line prefer-destructuring -- process.env doesn't have a proper iterator
const CMS_AUTH_SECRET = process.env["CMS_AUTH_SECRET"];

/* If there's no signing secret defined, prevent further damage */
if (!CMS_AUTH_SECRET) {
	throw new Error(
		"Leider kann diese Seite aktuell keine Anfragen bearbeiten.",
	);
}

/**
 * A session cookie to store insensitive data in.
 * 🚨 This is only signed, not encrypted. The client can't falsify the value, **but it can be read out!** 🚨
 */
export const sessionStorage = createCookieSessionStorage({
	cookie: {
		httpOnly: true,
		maxAge: 604800,
		name: "cms_auth",
		path: "/",
		sameSite: process.env["NODE_ENV"] !== "development" ? "strict" : "none",
		secrets: [CMS_AUTH_SECRET],
		secure: process.env["NODE_ENV"] !== "development",
	},
});
