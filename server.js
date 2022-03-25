/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-extraneous-dependencies */
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";
// import { createCloudflareKVSessionStorage } from "remix";

const { CMS_AUTH_SECRET } = process.env;

/* We need a secret key to sign the session cookie */
if (!CMS_AUTH_SECRET) {
	throw new Error(
		"API Authorization secret is undefined, server can't handle requests at the moment.",
	);
}

const handleRequest = createPagesFunctionHandler({
	build,
	getLoadContext: (context) => ({
		...context.env,
		/* Creates a session cookie that seldom contains an ID backed by storage in Cloudflare KV */
		// sessionStorage: createCloudflareKVSessionStorage({
		// 	cookie: {
		// 		httpOnly: true,
		// 		maxAge: 86400, // 1 day in seconds
		// 		name: "SESSION_ID",
		// 		path: "/",
		// 		sameSite:
		// 			process.env.NODE_ENV !== "development"
		// 				? "strict"
		// 				: "none" /* This allows local development tools to access the cookie */,
		// 		secrets: [CMS_AUTH_SECRET],
		// 		secure: process.env.NODE_ENV !== "development",
		// 	},
		// 	kv: context.env.sessionStorage,
		// }),
	}),
	mode: process.env.NODE_ENV,
});

export function onRequest(context) {
	return handleRequest(context);
}
