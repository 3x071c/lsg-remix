import type { LoaderFunction } from "remix";
import { LinkIcon } from "@chakra-ui/icons";
import {
	Heading,
	Text,
	SimpleGrid,
	Box,
	Badge,
	Flex,
	chakra,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation, useCatch } from "remix";
import { authorize } from "~feat/auth";
import {
	CatchBoundary as NestedCatchBoundary,
	ErrorBoundary as NestedErrorBoundary,
} from "~feat/boundaries";
import { LinkButton } from "~feat/links";
import { catchMessage } from "~lib/catch";
import { respond, useLoaderResponse } from "~lib/response";
import { getPages } from "../admin";

type LoaderData = {
	firstname?: string;
	headers: HeadersInit;
	lastname?: string;
	pages: {
		authorized?: boolean;
		hidden?: boolean;
		id: number;
		long: string;
		short: string;
		url: string;
	}[];
	status: number;
};
const getLoaderData = async (request: Request): Promise<LoaderData> => {
	const [
		{
			firstname,
			lastname,
			canAccessCMS,
			canAccessLab,
			canAccessSchoolib,
			canAccessTicker,
			canAccessUsers,
		},
		headers,
	] = await authorize(request);

	const pages = getPages({
		canAccessCMS,
		canAccessLab,
		canAccessSchoolib,
		canAccessTicker,
		canAccessUsers,
	});

	return {
		firstname,
		headers,
		lastname,
		pages,
		status: 200,
	};
};
export const loader: LoaderFunction = async ({ request }) =>
	respond<LoaderData>(await getLoaderData(request));

export default function Admin(): JSX.Element {
	const { firstname, lastname, pages } = useLoaderResponse<LoaderData>();
	const location = useLocation();
	const [route, setRoute] = useState<string>(location.pathname);

	useEffect(() => {
		setRoute(location.pathname);
	}, [route, location.pathname]);

	return (
		<chakra.main w="full">
			<Heading as="h3">
				Hallo {firstname} {lastname} 👋
			</Heading>
			<Text>Auf Dienste zugreifen:</Text>
			<SimpleGrid
				minChildWidth={270}
				spacing={4}
				mt={8}
				mx="auto"
				placeItems="center">
				{pages
					.filter(({ url }) => !url.endsWith(route))
					.filter(({ hidden }) => !hidden)
					.map(({ authorized, id, long, url }) => (
						<Box
							key={id}
							w="full"
							p="5"
							borderWidth={1}
							borderRadius="lg">
							<Flex align="baseline">
								<Badge
									px="2"
									colorScheme="teal"
									borderRadius="full">
									Dienst
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
							<Flex justify="flex-end">
								<LinkButton
									href={authorized ? url : "."}
									rightIcon={<LinkIcon />}
									isDisabled={!authorized}
									size="xs"
									variant="outline">
									{authorized ? "Besuchen" : "Kein Zugriff"}
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

	return (
		<NestedErrorBoundary message={message} name="Administrationsseite" />
	);
}
