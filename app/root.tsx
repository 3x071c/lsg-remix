import type { StyleSheet } from "@emotion/utils";
import { withEmotionCache } from "@emotion/react";
import { memo, PropsWithChildren, useContext, useMemo } from "react";
import {
	MetaFunction,
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useCatch,
} from "remix";
import { ColorModeManager, ColorModeToggle } from "~app/colormode";
import { EmotionServerContext, EmotionClientContext } from "~app/emotion";
import { useOnRemount } from "~app/remount";
import InnerCatchBoundary from "./CatchBoundary";
import InnerErrorBoundary from "./ErrorBoundary";

export const meta: MetaFunction = () => {
	return { title: "LSG" };
};

const Document = memo(
	withEmotionCache(function InnerDocument(
		{ children, title }: PropsWithChildren<{ title?: string }>,
		emotionCache,
	) {
		const emotionServerContext = useContext(EmotionServerContext);
		const emotionClientContext = useContext(EmotionClientContext);

		// Only executed on client, when Document is re-mounted (error boundary)
		useOnRemount(
			() => {
				// re-link sheet container
				// eslint-disable-next-line no-param-reassign
				emotionCache.sheet.container = document.head;

				// re-inject tags
				const { tags } = emotionCache.sheet;
				emotionCache.sheet.flush();
				tags.forEach((tag) => {
					// eslint-disable-next-line no-underscore-dangle -- External, Private API
					(
						emotionCache.sheet as unknown as {
							_insertTag: (
								tag: StyleSheet["tags"][number],
							) => unknown;
						}
					)._insertTag(tag);
				});

				// reset cache to re-apply global styles
				return emotionClientContext?.reset();
			},
			[],
			"Document",
		);

		const child = useMemo(
			() => (
				<html lang="de">
					<head>
						{emotionServerContext?.map(({ key, ids, css }) => (
							<style
								key={key}
								data-emotion={`${key} ${ids.join(" ")}`}
								// eslint-disable-next-line react/no-danger
								dangerouslySetInnerHTML={{ __html: css }}
							/>
						))}
						<meta charSet="utf-8" />
						<meta
							name="viewport"
							content="width=device-width,initial-scale=1"
						/>
						{title ? <title>{title}</title> : null}
						<Meta />
						<Links />
					</head>
					<body>
						<ColorModeManager>
							<ColorModeToggle />
							{children}
						</ColorModeManager>
						<ScrollRestoration />
						<Scripts />
						<LiveReload />
					</body>
				</html>
			),
			[emotionServerContext, title, children],
		);
		return child;
	}),
);

export default function App() {
	return (
		<Document>
			<Outlet />
		</Document>
	);
}

export function CatchBoundary() {
	const caught = useCatch();
	const messages: {
		[key: string]: string;
	} = {
		401: "Die Authentifizierung ist für den Zugriff fehlgeschlagen 😳",
		404: "Wir haben überall gesucht 👉👈🥺",
	};
	const message = Object.keys(messages).includes(caught.status.toString())
		? messages[caught.status.toString()] ||
		  "Hier haben sich mehrere Fehler eingeschlichen 🧐"
		: "Unbekannter Fehler - Bei wiederholtem, unvorhergesehenen Auftreten bitte melden 🤯";

	return (
		<Document title={`${caught.status} | LSG`}>
			<InnerCatchBoundary
				message={message}
				status={caught.status}
				statusText={caught.statusText}
			/>
		</Document>
	);
}

export function ErrorBoundary({ error }: { error: Error }) {
	// eslint-disable-next-line no-console
	console.error(error);

	return (
		<Document title={`${error.name} | LSG`}>
			<InnerErrorBoundary message={error.message} name={error.name} />
		</Document>
	);
}
