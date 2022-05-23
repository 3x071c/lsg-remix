/* eslint-disable no-console */
import type { PropsWithChildren } from "react";
import {
	Center,
	chakra,
	Heading,
	Text,
	Code,
	useTheme,
	useColorModeValue,
} from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import { Provider as JotaiProvider } from "jotai";
import { useRef } from "react";
import {
	LiveReload,
	Outlet,
	Scripts,
	ScrollRestoration,
	useCatch,
} from "remix";
import { ColorModeToggle, ColorModeManager } from "~app/colormode";
import { HeaderPortalContext } from "~feat/headerportal";
import { Link } from "~feat/links";
import { catchMessage } from "~lib/catch";

function Root({ children }: PropsWithChildren<unknown>) {
	return (
		<JotaiProvider>
			<ColorModeManager>
				{children}
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
				<ColorModeToggle />
			</ColorModeManager>
		</JotaiProvider>
	);
}

function InnerApp(): JSX.Element {
	const headerPortalRef = useRef<HTMLElement | null>(null);
	const themeHook = useTheme();
	const bg = useColorModeValue("white", "gray.800");
	const blurredBg = useColorModeValue(
		"whiteAlpha.800",
		transparentize("gray.800", 0.8)(themeHook),
	);

	return (
		<>
			<chakra.header
				w="full"
				pos="sticky"
				zIndex={2}
				top={0}
				bg={bg}
				ref={headerPortalRef}
				sx={{
					"@supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none))":
						{
							/* According to the spec, backdrop-filters essentially can't be nested (only works on Safari), so we'll have to put those filters into pseudo elements for the other browsers */
							_before: {
								backdropFilter: "auto",
								// eslint-disable-next-line sort-keys -- Blur has to come after `auto` filter for this to work!
								backdropBlur: "md",
								bg: blurredBg,
								content: '""',
								h: "full",
								pos: "absolute",
								w: "full",
								zIndex: -1,
							},
							bg: "transparent",
						} /* SMH, now it doesn't work on Safari anymore O_O (toggling the CSS property in the inspector fixes it) WTF??? */,
				}}
			/>
			<HeaderPortalContext.Provider value={headerPortalRef}>
				<Outlet />
			</HeaderPortalContext.Provider>
		</>
	);
}

export default function App(): JSX.Element {
	return (
		<Root>
			<InnerApp />
		</Root>
	);
}

export function CatchBoundary(): JSX.Element {
	const caught = useCatch();
	console.error("⚠️ Caught:", caught);
	const { status, statusText } = caught;
	const message = catchMessage(status);

	return (
		<Root>
			<Center w="100%" minH="100%" p={4}>
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
		</Root>
	);
}

export function ErrorBoundary({ error }: { error: Error }): JSX.Element {
	console.error("🚨 ERROR:", error);
	const { name, message } = error;

	return (
		<Root>
			<Center w="100%" minH="100%" p={4}>
				<chakra.main p={2} textAlign="center">
					<Heading as="h1" size="xl">
						{name}
					</Heading>
					<Text fontSize="md">
						Ein kritischer Fehler ist aufgetreten.
					</Text>
					<Code
						maxW="lg"
						my={2}
						d="block"
						colorScheme="red"
						fontSize="sm">
						{message}
					</Code>
					<Link href="/" variant="indicating">
						Hier geht&apos;s zurück
					</Link>
				</chakra.main>
			</Center>
		</Root>
	);
}
