import type { ColorMode } from "@chakra-ui/react";
import type { EntryContext } from "remix";
import { storageKey } from "@chakra-ui/react";
import { renderToString } from "react-dom/server";
import { RemixServer } from "remix";
import { ColorModeContext } from "~app/colormode";
import theme from "~app/theme";

export default function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext,
) {
	const cookies = request.headers.get("Cookie");
	const colorModeCookie = cookies?.match(
		new RegExp(`(^| )${storageKey}=([^;]+)`),
	)?.[2];
	console.log(`[SERVER]`, colorModeCookie);
	const render = renderToString(
		<ColorModeContext.Provider
			value={(colorModeCookie as ColorMode) || null}>
			<RemixServer context={remixContext} url={request.url} />,
		</ColorModeContext.Provider>,
	);

	responseHeaders.set("Content-Type", "text/html");

	return new Response(`<!DOCTYPE html>${render}`, {
		headers: responseHeaders,
		status: responseStatusCode,
	});
}
