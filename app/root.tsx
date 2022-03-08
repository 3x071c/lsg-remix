import type { PropsWithChildren } from "react";
import type { MetaFunction } from "remix";
import { ChakraProvider, Heading } from "@chakra-ui/react";
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useCatch,
} from "remix";
import { Container } from "~app/layout";
import theme from "~app/theme";

export const meta: MetaFunction = () => {
	return { title: "LSG" };
};

function Document({ children, title }: PropsWithChildren<{ title?: string }>) {
	return (
		<html lang="de">
			<head>
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
				{children}
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}

export default function App() {
	return (
		<Document>
			<ChakraProvider theme={theme}>
				<Container>
					<Outlet />
				</Container>
			</ChakraProvider>
		</Document>
	);
}

export function CatchBoundary() {
	const caught = useCatch();

	return (
		<Document title={`${caught.status} ${caught.statusText}`}>
			<ChakraProvider theme={theme}>
				<Container>
					<Heading as="h1" bg="purple.600">
						[CatchBoundary]: {caught.status} {caught.statusText}
					</Heading>
				</Container>
			</ChakraProvider>
		</Document>
	);
}

export function ErrorBoundary({ error }: { error: Error }) {
	return (
		<Document title="Error!">
			<ChakraProvider theme={theme}>
				<Container>
					<Heading as="h1" bg="blue.500">
						[ErrorBoundary]: There was an error: {error.message}
					</Heading>
				</Container>
			</ChakraProvider>
		</Document>
	);
}
