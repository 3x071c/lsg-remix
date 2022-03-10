import type { EntryContext } from "remix";
import { renderToString } from "react-dom/server";
import { RemixServer } from "remix";
import {
	ColorModeContext,
	getColorModeCookie,
	getInitialColorModeCookie,
	InitialColorModeContext,
} from "~app/colormode";

export default function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext,
) {
	const render = renderToString(
		<InitialColorModeContext.Provider
			value={
				getInitialColorModeCookie(
					request.headers.get("Cookie") || "",
				) || null
			}>
			<ColorModeContext.Provider
				value={
					getColorModeCookie(request.headers.get("Cookie") || "") ||
					null
				}>
				<RemixServer context={remixContext} url={request.url} />,
			</ColorModeContext.Provider>
			,
		</InitialColorModeContext.Provider>,
	);

	responseHeaders.set("Content-Type", "text/html");

	return new Response(`<!DOCTYPE html>${render}`, {
		headers: responseHeaders,
		status: responseStatusCode,
	});
}
