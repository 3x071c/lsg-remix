import { EditIcon } from "@chakra-ui/icons";
import {
	Heading,
	Wrap,
	WrapItem,
	Text,
	SimpleGrid,
	Box,
	Badge,
	Flex,
	Button,
} from "@chakra-ui/react";
import { json, LoaderFunction, useLoaderData } from "remix";
import { authorize } from "~app/auth";
import { Nav } from "~app/cms";
import { pages, users } from "~app/models";

const getLoaderData = async (request: Request) => {
	const { uuid } = await authorize(request);
	return {
		pageTitles: await pages().listValues("title"),
		userName: await users().getMany(uuid, ["firstname", "lastname"]),
	};
};
type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;
export const loader: LoaderFunction = async ({ request }) =>
	json<LoaderData>(await getLoaderData(request));

export default function Index(): JSX.Element {
	const {
		pageTitles: { data },
		userName: { firstname, lastname },
	} = useLoaderData<LoaderData>();

	return (
		<Wrap maxW="100%">
			<WrapItem flex="none">
				<Nav fullName={`${firstname} ${lastname}`} />
			</WrapItem>
			<WrapItem flex="1 1 auto">
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
					{data.map(({ value: title, uuid }) => (
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
			</WrapItem>
		</Wrap>
	);
}

export const url = "/admin/cms";
