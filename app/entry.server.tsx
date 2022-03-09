import type { ColorMode } from "@chakra-ui/react";
import type { EntryContext } from "remix";
import { renderToString } from "react-dom/server";
import { RemixServer } from "remix";
import { ColorModeContext, colorModeFromHeader } from "~app/colormode";

export default function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext,
) {
	const render = renderToString(
		<ColorModeContext.Provider
			value={
				(colorModeFromHeader(
					request.headers.get("Cookie") || "",
				) as ColorMode) || null
			}>
			<RemixServer context={remixContext} url={request.url} />,
		</ColorModeContext.Provider>,
	);

	responseHeaders.set("Content-Type", "text/html");

	return new Response(`<!DOCTYPE html>${render}`, {
		headers: responseHeaders,
		status: responseStatusCode,
	});
}
