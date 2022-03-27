import type { StyleSheet } from "@emotion/utils";
import { Center, chakra, Heading, Text, Code } from "@chakra-ui/react";
import { withEmotionCache } from "@emotion/react";
import { memo, PropsWithChildren, useContext } from "react";
import {
	MetaFunction,
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useCatch,
	LoaderFunction,
	json,
	useLoaderData,
} from "remix";
import { ColorModeManager, ColorModeToggle } from "~app/colormode";
import {
	EmotionServerContext,
	EmotionClientContext,
	EmotionServerContextData,
} from "~app/emotion";
import { LinkButton } from "~app/links";
import { useOnRemount } from "~app/remount";

export const meta: MetaFunction = () => {
	return { title: "LSG" };
};

const getLoaderData = () => {
	return {
		env: {
			MAGIC_KEY: process.env["MAGIC_KEY"],
			NODE_ENV: process.env["NODE_ENV"],
		},
	};
};
type LoaderData = ReturnType<typeof getLoaderData>;
export const loader: LoaderFunction = () => json<LoaderData>(getLoaderData());

declare global {
	interface Window {
		env: LoaderData["env"];
	}
}

const DocumentChild = memo(
	({
		emotionServerContext,
		title,
		children,
	}: PropsWithChildren<{
		emotionServerContext: EmotionServerContextData;
		title?: string;
	}>) => {
		const { env } = useLoaderData<LoaderData>();

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
					<script
						// eslint-disable-next-line react/no-danger
						dangerouslySetInnerHTML={{
							__html: `window.ENV = ${JSON.stringify(env)}`,
						}}
					/>
				</body>
			</html>
		);
	},
);

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

		return (
			<DocumentChild
				emotionServerContext={emotionServerContext}
				title={title}>
				{children}
			</DocumentChild>
		);
	}),
);

export default function App(): JSX.Element {
	return (
		<Document>
			<Outlet />
		</Document>
	);
}

export function CatchBoundary(): JSX.Element {
	const { status, statusText } = useCatch();
	const messages: {
		[key: string]: string;
	} = {
		401: "Die Authentifizierung ist für den Zugriff fehlgeschlagen 😳",
		404: "Wir haben überall gesucht 👉👈🥺",
	};
	const message = Object.keys(messages).includes(status.toString())
		? messages[status.toString()] ||
		  "Hier haben sich mehrere Fehler eingeschlichen 🧐"
		: "Unbekannter Fehler - Bei wiederholtem, unvorhergesehenen Auftreten bitte melden 🤯";

	return (
		<Document title={`${status} | LSG`}>
			<Center minW="100vw" minH="100vh">
				<chakra.main maxW="90%" py={8} textAlign="center">
					<Heading as="h1" size="xl">
						{statusText}
					</Heading>
					<Text fontSize="md">
						Houston, we&apos;ve had a {status}
					</Text>
					<Text my={2} fontSize="sm">
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

export function ErrorBoundary({
	error: { message, name },
}: {
	error: Error;
}): JSX.Element {
	return (
		<Document title={`${name} | LSG`}>
			<Center minW="100vw" minH="100vh">
				<chakra.main maxW="90%" py={8} textAlign="center">
					<Heading as="h1" size="xl">
						{name}
					</Heading>
					<Text fontSize="md">
						Ein kritischer Fehler ist aufgetreten.
					</Text>
					<Code d="block" my={2} colorScheme="red" fontSize="sm">
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
