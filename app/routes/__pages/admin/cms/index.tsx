import { EditIcon } from "@chakra-ui/icons";
import {
	Heading,
	Text,
	SimpleGrid,
	Box,
	Badge,
	Flex,
	Button,
	chakra,
} from "@chakra-ui/react";
import { json, LoaderFunction, useLoaderData } from "remix";
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
		<chakra.main>
			<Heading as="h1" size="xl">
				Content Management
			</Heading>
			<Text fontSize="md" mt={2}>
				Seiten einsehen und bearbeiten
			</Text>
			<SimpleGrid
				spacing="20px"
				minChildWidth="200px"
				mt={8}
				mx="auto"
				placeItems="center">
				{pageData.map(({ value: title, uuid }) => (
					<Box p="5" borderWidth="1px" w="full" key={uuid}>
						<Flex align="baseline">
							<Badge
								borderRadius="full"
								px="2"
								colorScheme="teal">
								Page
							</Badge>
							<Text
								ml={2}
								textTransform="uppercase"
								fontSize="sm"
								fontWeight="semibold"
								letterSpacing="wide">
								ID &bull; #{uuid}
							</Text>
						</Flex>
						<Text
							my={2}
							fontSize="xl"
							fontWeight="bold"
							lineHeight="tight"
							isTruncated>
							{title}
						</Text>
						<Flex justifyContent="flex-end">
							<Button
								size="xs"
								variant="outline"
								colorScheme="green"
								rightIcon={<EditIcon />}>
								Bearbeiten
							</Button>
						</Flex>
					</Box>
				))}
			</SimpleGrid>
		</chakra.main>
	);
}

export const url = "/admin/cms";
