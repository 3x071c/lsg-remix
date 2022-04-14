import type { LoaderFunction } from "remix";
import {
	Heading,
	Text,
	chakra,
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	StatGroup,
} from "@chakra-ui/react";
import { json, useLoaderData } from "remix";
import { pages } from "~app/models";

const getLoaderData = async () => {
	const { data: pageData } = await pages().listValues("title");

	return {
		pageData,
	};
};
type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;
export const loader: LoaderFunction = async () =>
	json<LoaderData>(await getLoaderData());

export default function Index(): JSX.Element {
	const { pageData } = useLoaderData<LoaderData>();

	return (
		<chakra.main w="full">
			<Heading as="h1" size="xl">
				Content Management
			</Heading>
			<Text fontSize="md" mt={2}>
				Seiten einsehen und bearbeiten
			</Text>
			<StatGroup
				mt={8}
				borderWidth="1px"
				borderRadius="2xl"
				textAlign="center">
				<Stat borderRightWidth="1px">
					<StatLabel>Seiten</StatLabel>
					<StatNumber>{pageData.length}</StatNumber>
					<StatHelpText>Anzahl</StatHelpText>
				</Stat>

				<Stat>
					<StatLabel>Status</StatLabel>
					<StatNumber>OK</StatNumber>
					<StatHelpText>Operational</StatHelpText>
				</Stat>
			</StatGroup>
		</chakra.main>
	);
}

export const url = "/admin/cms";
