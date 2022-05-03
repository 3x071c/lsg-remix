/* eslint-disable no-console */
import type { PropsWithChildren } from "react";
import {
	Center,
	chakra,
	Heading,
	Text,
	Code,
	ChakraProvider,
} from "@chakra-ui/react";
import { Provider as JotaiProvider } from "jotai";
import {
	LiveReload,
	Outlet,
	Scripts,
	ScrollRestoration,
	useCatch,
} from "remix";
import { ColorModeToggle, ColorModeManager } from "~app/colormode";
import { theme } from "~feat/chakra";
import { Link } from "~feat/links";
import { keys } from "~lib/util";

function Root({ children }: PropsWithChildren<unknown>) {
	return (
		<>
			{children}
			<ScrollRestoration />
			<Scripts />
			<LiveReload />
		</>
	);
}

export default function App(): JSX.Element {
	return (
		<Root>
			<JotaiProvider>
				<ColorModeManager>
					<ColorModeToggle />
					<Outlet />
				</ColorModeManager>
			</JotaiProvider>
		</Root>
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
		<Root>
			<ChakraProvider theme={theme}>
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
						<Link href="/" variant="indicating">
							Hier geht&apos;s zurück
						</Link>
					</chakra.main>
				</Center>
			</ChakraProvider>
		</Root>
	);
}

export function ErrorBoundary({ error }: { error: Error }): JSX.Element {
	console.error("🚨 ERROR:", error);
	const { name, message } = error;

	return (
		<Root>
			<ChakraProvider theme={theme}>
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
						<Link href="/" variant="indicating">
							Hier geht&apos;s zurück
						</Link>
					</chakra.main>
				</Center>
			</ChakraProvider>
		</Root>
	);
}
