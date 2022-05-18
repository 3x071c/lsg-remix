import type { EntryContext } from "remix";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import Cookie from "cookie";
import { renderToString } from "react-dom/server";
import { RemixServer } from "remix";
import { ColorModeContext } from "~app/colormode";

const env = {
	MAGIC_KEY: process.env["MAGIC_KEY"],
	NODE_ENV: process.env.NODE_ENV,
};

declare global {
	interface Window {
		env: typeof env;
	}
}

export default function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext,
): Response {
	const cache = createCache({ key: "css" });
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const { extractCriticalToChunks, constructStyleTagsFromChunks } =
		createEmotionServer(cache);

	const html = renderToString(
		<CacheProvider value={cache}>
			<ColorModeContext.Provider
				value={
					Cookie.parse(request.headers.get("Cookie") || "")[
						"colorMode"
					] === "dark"
						? "dark"
						: "light"
				}>
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
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<title>LSG</title>
			</head>
			<body>
				<div id="__remix">`
			.trim()
			.replaceAll(/\s+/g, " ") +
			html +
			`</div>
			<script>
			window.env = ${JSON.stringify(env)};
			</script>
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
