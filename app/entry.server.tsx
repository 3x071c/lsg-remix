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

export default function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext,
) {
	const cache = createEmotionCache();
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const { extractCriticalToChunks } = createEmotionServer(cache);

	const prerender = renderToString(
		<EmotionServerContext.Provider value={null}>
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
		</EmotionServerContext.Provider>,
	);

	const chunks = extractCriticalToChunks(prerender);
	const render = renderToString(
		<EmotionServerContext.Provider value={chunks.styles}>
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
		</EmotionServerContext.Provider>,
	);

	responseHeaders.set("Content-Type", "text/html");

	return new Response(`<!DOCTYPE html>${render}`, {
		headers: responseHeaders,
		status: responseStatusCode,
	});
}
