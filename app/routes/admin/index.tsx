import { LinkIcon, LockIcon } from "@chakra-ui/icons";
import {
	Heading,
	Text,
	SimpleGrid,
	Box,
	Badge,
	Flex,
	Container,
} from "@chakra-ui/react";
import { json, LoaderFunction, useLoaderData } from "remix";
import { authorize } from "~app/auth";
import { LinkButton } from "~app/links";
import { users } from "~app/models";
import { url as cmsURL } from "~routes/admin/cms";
import { url as logoutURL } from "~routes/admin/logout";

const getLoaderData = async (request: Request) => {
	const { uuid } = await authorize(request);
	return users().getMany(uuid, ["firstname", "lastname"]);
};
type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;
export const loader: LoaderFunction = async ({ request }) =>
	json<LoaderData>(await getLoaderData(request));

export default function Index(): JSX.Element {
	const { firstname, lastname } = useLoaderData<LoaderData>();

	return (
		<>
			<LinkButton
				href={logoutURL}
				size="lg"
				pos="fixed"
				top="20px"
				right="20px"
				zIndex={9}
				variant="outline"
				rightIcon={<LockIcon />}>
				Abmelden
			</LinkButton>
			<Container w="full" maxW="7xl" mx="auto" py={8} centerContent>
				<Heading>
					Hallo {firstname} {lastname} 👋
				</Heading>
				<Text>Auf Dienste zugreifen:</Text>
				<SimpleGrid
					spacing="20px"
					minChildWidth="200px"
					mt={8}
					mx="auto"
					placeItems="center">
					<Box p="5" borderWidth="1px" w="full">
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
							Content Management System
						</Text>
						<Flex justifyContent="flex-end">
							<LinkButton
								href={cmsURL}
								size="xs"
								variant="outline"
								rightIcon={<LinkIcon />}>
								Besuchen
							</LinkButton>
						</Flex>
					</Box>
				</SimpleGrid>
			</Container>
		</>
	);
}

export const url = "/admin";
