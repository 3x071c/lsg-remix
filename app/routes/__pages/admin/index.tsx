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
import { useLocation } from "remix";
import { authorize } from "~feat/auth";
import { LinkButton } from "~feat/links";
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
			canAccessUsers,
		},
		headers,
	] = await authorize(request);

	const pages = getPages({
		canAccessCMS,
		canAccessLab,
		canAccessSchoolib,
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

export default function Index(): JSX.Element {
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
				spacing="20px"
				minChildWidth="200px"
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
							borderWidth="1px"
							borderRadius="lg">
							<Flex align="baseline">
								<Badge
									borderRadius="full"
									px="2"
									colorScheme="teal">
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
							<Flex justifyContent="flex-end">
								<LinkButton
									href={authorized ? url : "."}
									size="xs"
									variant="outline"
									rightIcon={<LinkIcon />}
									isDisabled={!authorized}>
									{authorized ? "Besuchen" : "Kein Zugriff"}
								</LinkButton>
							</Flex>
						</Box>
					))}
			</SimpleGrid>
		</chakra.main>
	);
}
