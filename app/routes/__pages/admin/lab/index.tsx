import type { LoaderFunction } from "remix";
import { LinkIcon } from "@chakra-ui/icons";
import {
	Heading,
	chakra,
	Text,
	SimpleGrid,
	Box,
	Badge,
	Flex,
} from "@chakra-ui/react";
import { useCatch } from "remix";
import { authorize } from "~feat/auth";
import {
	CatchBoundary as NestedCatchBoundary,
	ErrorBoundary as NestedErrorBoundary,
} from "~feat/boundaries";
import { LinkButton } from "~feat/links";
import { catchMessage } from "~lib/catch";
import { respond } from "~lib/response";
import { entries } from "~lib/util";

type LoaderData = {
	headers: HeadersInit;
	status: number;
};
const getLoaderData = async (request: Request): Promise<LoaderData> => {
	const [, headers] = await authorize(request, { lab: true });

	return {
		headers,
		status: 200,
	};
};
export const loader: LoaderFunction = async ({ request }) =>
	respond<LoaderData>(await getLoaderData(request));

export const pages: {
	[key: string]: { long: string; short: string; url: string };
} = {
	1: {
		long: "Ticket Management Board",
		short: "Board",
		url: "/admin/lab/board",
	},
	2: { long: "Pizzabestellung", short: "Pizza", url: "/admin/lab/pizza" },
} as const;
export default function Index(): JSX.Element {
	return (
		<chakra.main w="full">
			<Heading as="h1">Ahoi Cäpt&apos;n 😳</Heading>
			<Text>Alle internen Admin Lab Projekte:</Text>
			<SimpleGrid
				spacing="20px"
				minChildWidth="200px"
				mt={8}
				mx="auto"
				placeItems="center">
				{entries(pages)
					.filter(([, { short }]) => short !== "Home")
					.map(([uuid, { long, url }]) => (
						<Box
							key={uuid}
							w="full"
							p="5"
							borderWidth="1px"
							borderRadius="lg">
							<Flex align="baseline">
								<Badge
									borderRadius="full"
									px="2"
									colorScheme="teal">
									Sus
								</Badge>
							</Flex>
							<Text
								my={2}
								fontSize="xl"
								fontWeight="bold"
								lineHeight="tight"
								isTruncated>
								{long}
							</Text>
							<Flex justifyContent="flex-end">
								<LinkButton
									href={url}
									size="xs"
									variant="outline"
									rightIcon={<LinkIcon />}>
									Besuchen
								</LinkButton>
							</Flex>
						</Box>
					))}
			</SimpleGrid>
		</chakra.main>
	);
}

export function CatchBoundary(): JSX.Element {
	const caught = useCatch();
	// eslint-disable-next-line no-console -- Log the caught message
	console.error("⚠️ Caught:", caught);
	const { status, statusText } = caught;
	const message = catchMessage(status);

	return (
		<NestedCatchBoundary
			message={message}
			status={status}
			statusText={statusText}
		/>
	);
}

export function ErrorBoundary({ error }: { error: Error }): JSX.Element {
	// eslint-disable-next-line no-console -- Log the error message
	console.error("🚨 ERROR:", error);
	const { message } = error;

	return <NestedErrorBoundary message={message} name="Admin Lab Übersicht" />;
}
