import type { EntryContext } from "remix";
import { renderToString } from "react-dom/server";
import { RemixServer } from "remix";

export default function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext,
) {
	const render = renderToString(
		<RemixServer context={remixContext} url={request.url} />,
	);

	responseHeaders.set("Content-Type", "text/html");

	return new Response(`<!DOCTYPE html>${render}`, {
		headers: responseHeaders,
		status: responseStatusCode,
	});
}
