import type { SessionStorage } from "remix";
import { createCookieSessionStorage } from "remix";

declare global {
	// eslint-disable-next-line vars-on-top, no-var
	var cmsAuthSessionStorage: SessionStorage | undefined;
}

/**
 * A session cookie to store insensitive data in.
 * 🚨 This is only signed, not encrypted. The client can't falsify the value, **but it can be read out!** 🚨
 */
export const cmsAuthSessionStorage = () =>
	global.cmsAuthSessionStorage ||
	(() => {
		const { CMS_AUTH_SECRET } = global.env;

		if (!CMS_AUTH_SECRET || typeof CMS_AUTH_SECRET !== "string") {
			throw new Error(
				"API Authorization secret is undefined, server can't handle requests at the moment.",
			);
		}

		// eslint-disable-next-line no-return-assign
		return (global.cmsAuthSessionStorage = createCookieSessionStorage({
			cookie: {
				httpOnly: true,
				maxAge: 604800,
				name: "cms_auth",
				path: "/",
				sameSite:
					global.env.NODE_ENV !== "development" ? "strict" : "lax",
				secrets: [CMS_AUTH_SECRET],
				secure: global.env.NODE_ENV !== "development",
			},
		}));
	})();
