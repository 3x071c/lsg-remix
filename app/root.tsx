/* eslint-disable no-console */
import type { StyleSheet } from "@emotion/utils";
import type { PropsWithChildren } from "react";
import type { MetaFunction, LoaderFunction } from "remix";
import { Center, chakra, Heading, Text, Code } from "@chakra-ui/react";
import { withEmotionCache } from "@emotion/react";
import { memo, useContext, useEffect } from "react";
import {
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
import { LinkButton } from "~app/links";
import { keys, respond, useLoaderResponse } from "~app/util";

export const meta: MetaFunction = () => {
	return { title: "LSG" };
};

type LoaderData = {
	env: {
		MAGIC_KEY: string | undefined;
		NODE_ENV: "development" | "production" | "test";
	};
	status: number;
};
const getLoaderData = (): LoaderData => {
	return {
		env: {
			MAGIC_KEY: process.env["MAGIC_KEY"],
			NODE_ENV: process.env.NODE_ENV,
		},
		status: 200,
	};
};
export const loader: LoaderFunction = () =>
	respond<LoaderData>(getLoaderData());

declare global {
	interface Window {
		env: LoaderData["env"];
	}
}

const Document = memo(
	withEmotionCache(function InnerDocument(
		{
			children,
			title,
			env,
		}: PropsWithChildren<{ title?: string; env?: LoaderData["env"] }>,
		emotionCache,
	) {
		const emotionServerContext = useContext(EmotionServerContext);
		const emotionClientContext = useContext(EmotionClientContext);

		// Only executed on client, when Document is re-mounted (error boundary)
		useEffect(() => {
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
			// eslint-disable-next-line react-hooks/exhaustive-deps -- Only trigger on remount
		}, []);

		return (
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
					{env && (
						<script
							// eslint-disable-next-line react/no-danger
							dangerouslySetInnerHTML={{
								__html: `window.env = ${JSON.stringify(env)}`,
							}}
						/>
					)}
				</body>
			</html>
		);
	}),
);

export default function App(): JSX.Element {
	const { env } = useLoaderResponse<LoaderData>();

	return (
		<Document env={env}>
			<Outlet />
		</Document>
	);
}

export function CatchBoundary(): JSX.Element {
	const caught = useCatch();
	console.error("⚠️ Caught:", caught);
	const { status, statusText } = caught;
	const messages: {
		[key: string]: string;
	} = {
		401: "Die Authentifizierung ist für den Zugriff fehlgeschlagen 😳",
		404: "Wir haben überall gesucht 👉👈🥺",
	};
	const message = keys(messages).includes(status.toString())
		? messages[status.toString()] ||
		  "Hier haben sich mehrere Fehler eingeschlichen 🧐"
		: "Unbekannter Fehler - Bei wiederholtem, unvorhergesehenen Auftreten bitte melden 🤯";

	return (
		<Document title={`${status} | LSG`}>
			<Center minW="100vw" minH="100vh">
				<chakra.main p={2} textAlign="center">
					<Heading as="h1" size="xl">
						{statusText}
					</Heading>
					<Text fontSize="md">
						Houston, we&apos;ve had a {status}
					</Text>
					<Text maxW="lg" my={2} fontSize="sm">
						{message}
					</Text>
					<LinkButton href="/" variant="link">
						Hier geht&apos;s zurück
					</LinkButton>
				</chakra.main>
			</Center>
		</Document>
	);
}

export function ErrorBoundary({ error }: { error: Error }): JSX.Element {
	console.error("🚨 ERROR:", error);
	const { name, message } = error;

	return (
		<Document title={`${name} | LSG`}>
			<Center minW="100vw" minH="100vh">
				<chakra.main p={2} textAlign="center">
					<Heading as="h1" size="xl">
						{name}
					</Heading>
					<Text fontSize="md">
						Ein kritischer Fehler ist aufgetreten.
					</Text>
					<Code
						d="block"
						maxW="lg"
						my={2}
						colorScheme="red"
						fontSize="sm">
						{message}
					</Code>
					<LinkButton href="/" variant="link">
						Hier geht&apos;s zurück
					</LinkButton>
				</chakra.main>
			</Center>
		</Document>
	);
}
