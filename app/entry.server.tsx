/* eslint-disable react/jsx-no-constructed-context-values */
import type { EntryContext } from "remix";
import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import { renderToString } from "react-dom/server";
import { RemixServer } from "remix";
import {
	ColorModeContext,
	getColorModeCookie,
	getInitialColorModeCookie,
} from "~app/colormode";
import { createEmotionCache } from "~app/emotion";

export default function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext,
): Response {
	const cache = createEmotionCache();
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const { extractCriticalToChunks, constructStyleTagsFromChunks } =
		createEmotionServer(cache);

	const html = renderToString(
		<CacheProvider value={cache}>
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
		</CacheProvider>,
	);

	const chunks = extractCriticalToChunks(html);
	const styles = constructStyleTagsFromChunks(chunks);

	responseHeaders.set("Content-Type", "text/html");
	return new Response(
		`<!DOCTYPE html>
		<html lang="de">
			<head>
				${styles}
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width,initial-scale=1"
				/>
				<title>LSG</title>
			</head>
			<body>
				<div id="__remix">`
			.trim()
			.replaceAll(/\s+/g, " ") +
			html +
			`</div>
			</body>
		</html>`
				.trim()
				.replaceAll(/\s+/g, " "),
		{
			headers: responseHeaders,
			status: responseStatusCode,
		},
	);
}
