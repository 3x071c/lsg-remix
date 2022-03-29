/* eslint-disable @typescript-eslint/ban-ts-comment -- FEEL THE POWER */
import { createCookieSessionStorage } from "remix";

let CMS_AUTH_SECRET: string;

export const setSessionEnv = (env: AppLoadContextEnvType) => {
	CMS_AUTH_SECRET = env["CMS_AUTH_SECRET"] as string;
};

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
		// @ts-ignore
		sameSite: process.env.NODE_ENV !== "development" ? "strict" : "none",
		// @ts-ignore
		secrets: [CMS_AUTH_SECRET],
		// @ts-ignore
		secure: process.env.NODE_ENV !== "development",
	},
});
