import type { PropsWithChildren } from "react";
import { Heading } from "@chakra-ui/react";
import {
	MetaFunction,
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useCatch,
	json,
	LoaderFunction,
	useLoaderData,
} from "remix";
import { ColorModeManager } from "~app/colormode";
import { Container } from "~app/layout";

export const meta: MetaFunction = () => {
	return { title: "LSG" };
};

const getLoaderData = (request: Request) => ({
	cookie: request.headers.get("Cookie"),
});
type LoaderData = ReturnType<typeof getLoaderData>;
export const loader: LoaderFunction = ({ request }) => {
	return json<LoaderData>(getLoaderData(request));
};

function Document({ children, title }: PropsWithChildren<{ title?: string }>) {
	const { cookie } = useLoaderData<LoaderData>();

	console.log("[Document]", cookie);

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
				<ColorModeManager>{children}</ColorModeManager>
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
			<Container>
				<Outlet />
			</Container>
		</Document>
	);
}

export function CatchBoundary() {
	const caught = useCatch();

	return (
		<Document title={`${caught.status} ${caught.statusText}`}>
			<Container>
				<Heading as="h1" bg="purple.600">
					[CatchBoundary]: {caught.status} {caught.statusText}
				</Heading>
			</Container>
		</Document>
	);
}

export function ErrorBoundary({ error }: { error: Error }) {
	return (
		<Document title="Error!">
			<Container>
				<Heading as="h1" bg="blue.500">
					[ErrorBoundary]: There was an error: {error.message}
				</Heading>
			</Container>
		</Document>
	);
}
