/* eslint-disable import/no-extraneous-dependencies */
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";

const handleRequest = createPagesFunctionHandler({
	build,
	getLoadContext: (context) => {
		global.env = {
			/* drop-in replacement for process.env on CF Page Functions */
			...context.env,
			NODE_ENV: process.env.NODE_ENV,
		};
		return context;
	},
	mode: process.env.NODE_ENV,
});

export function onRequest(context) {
	return handleRequest(context);
}
