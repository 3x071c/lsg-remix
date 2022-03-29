/* eslint-disable react/jsx-no-constructed-context-values */
import type { EntryContext } from "remix";
import createEmotionServer from "@emotion/server/create-instance";
import { renderToString } from "react-dom/server";
import { RemixServer } from "remix";
import {
	ColorModeContext,
	getColorModeCookie,
	getInitialColorModeCookie,
} from "~app/colormode";
import { createEmotionCache, EmotionServerContext } from "~app/emotion";

const cache = createEmotionCache(); // TODO Figure out if global style caching is a good idea
// eslint-disable-next-line @typescript-eslint/unbound-method
const { extractCriticalToChunks } = createEmotionServer(cache);

export default function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext,
): Response {
	const markup = (
		<ColorModeContext.Provider
			value={{
				current: getColorModeCookie(
					request.headers.get("Cookie") || "",
				),
				initial: getInitialColorModeCookie(
					request.headers.get("Cookie") || "",
				),
			}}>
			<RemixServer context={remixContext} url={request.url} />
		</ColorModeContext.Provider>
	);

	const prerender = renderToString(
		<EmotionServerContext.Provider value={null}>
			{markup}
		</EmotionServerContext.Provider>,
	);

	const chunks = extractCriticalToChunks(prerender);
	const render = renderToString(
		<EmotionServerContext.Provider value={chunks.styles}>
			{markup}
		</EmotionServerContext.Provider>,
	);

	responseHeaders.set("Content-Type", "text/html");
	return new Response(`<!DOCTYPE html>${render}`, {
		headers: responseHeaders,
		status: responseStatusCode,
	});
}
