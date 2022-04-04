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
import { Nav as AdminNav } from "~app/admin";
import { authorize } from "~app/auth";
import { pages, users, pageGroups } from "~app/models";
import { Nav } from "~app/nav";
import { fromEntries } from "~app/util";

const getLoaderData = async (request: Request) => {
	const { uuid: userUUID } = await authorize(request);
	const { data: pageGroupNames } = await pageGroups().listValues("name");
	const { data: pageTitles } = await pages().listValues("title");

	const groupedPages = fromEntries<{
		[groupUUID: string]: {
			name: string;
			pages: {
				[pageUUID: string]: {
					title: string;
				};
			};
		};
	}>(
		pageGroupNames.map(({ value: name, uuid }) => [
			uuid,
			{
				name,
				pages: {},
			},
		]),
	);
	await Promise.all(
		pageTitles.map(async ({ value: title, uuid }) => {
			const { groupRef } = await pages().getMany(uuid, ["groupRef"]);
			const group = groupedPages[groupRef];
			if (!group)
				throw new Error(`Dangling groupRef (${groupRef}) in ${uuid}`);
			const groupPage = {
				title,
			};
			group.pages[uuid] = groupPage;
		}),
	);

	return {
		groupedPages,
		pageTitles: await pages().listValues("title"),
		userName: await users().getMany(userUUID, ["firstname", "lastname"]),
	};
};
type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;
export const loader: LoaderFunction = async ({ request }) =>
	json<LoaderData>(await getLoaderData(request));

export default function Index(): JSX.Element {
	const {
		groupedPages,
		pageTitles: { data },
		userName: { firstname, lastname },
	} = useLoaderData<LoaderData>();

	return (
		<chakra.main>
			<Nav groupedPages={groupedPages} />
			<AdminNav active="CMS" username={`${firstname} ${lastname}`} />
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
		</chakra.main>
	);
}

export const url = "/admin/cms";
