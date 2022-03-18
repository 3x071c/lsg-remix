import type { EntryContext } from "remix";
import createEmotionServer from "@emotion/server/create-instance";
import { renderToString } from "react-dom/server";
import { RemixServer } from "remix";
import {
	ColorModeContext,
	getColorModeCookie,
	getInitialColorModeCookie,
	InitialColorModeContext,
} from "~app/colormode";
import { createEmotionCache, EmotionServerContext } from "~app/emotion";
import { RemountProvider } from "~app/remount";

const cache = createEmotionCache(); // TODO Figure out if global style caching is a good idea
// eslint-disable-next-line @typescript-eslint/unbound-method
const { extractCriticalToChunks } = createEmotionServer(cache);

export default function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext,
) {
	const markup = (
		<RemountProvider>
			<InitialColorModeContext.Provider
				value={
					getInitialColorModeCookie(
						request.headers.get("Cookie") || "",
					) || null
				}>
				<ColorModeContext.Provider
					value={
						getColorModeCookie(
							request.headers.get("Cookie") || "",
						) || null
					}>
					<RemixServer context={remixContext} url={request.url} />
				</ColorModeContext.Provider>
			</InitialColorModeContext.Provider>
		</RemountProvider>
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
