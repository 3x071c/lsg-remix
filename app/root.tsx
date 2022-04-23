/* eslint-disable no-console */
import type { PropsWithChildren } from "react";
import type { LoaderFunction } from "remix";
import {
	Center,
	chakra,
	Heading,
	Text,
	Code,
	ChakraProvider,
} from "@chakra-ui/react";
import {
	LiveReload,
	Outlet,
	Scripts,
	ScrollRestoration,
	useCatch,
} from "remix";
import { ColorModeToggle } from "~app/colormode";
import { theme } from "~feat/chakra";
import { LinkButton } from "~feat/links";
import { respond, useLoaderResponse } from "~lib/response";
import { keys } from "~lib/util";

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

const Document = function InnerDocument({
	children,
	env,
}: PropsWithChildren<{ env?: LoaderData["env"] }>) {
	return (
		<>
			<ChakraProvider theme={theme}>
				<ColorModeToggle />
				{children}
			</ChakraProvider>
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
		</>
	);
};

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
		<Document>
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
		<Document>
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
