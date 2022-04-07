import {
	Heading,
	Text,
	Box,
	chakra,
	Container,
	useColorModeValue,
} from "@chakra-ui/react";
import { json, LoaderFunction, useLoaderData } from "remix";
import { Awards } from "~app/awards";
import { Hero } from "~app/hero";
import { pages, pageGroups } from "~app/models";
import { Navbar } from "~app/nav";
import { fromEntries } from "~app/util";

const getLoaderData = async () => {
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
	};
};
type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;
export const loader: LoaderFunction = async () =>
	json<LoaderData>(await getLoaderData());

export default function Index(): JSX.Element {
	const { groupedPages } = useLoaderData<LoaderData>();

	return (
		<>
			<Navbar groupedPages={groupedPages} />
			<Container
				w="full"
				// bg="#f6f9fc"
				bg={useColorModeValue("gray.50", "")}
				maxW="full"
				mx="auto"
				py={8}
				pos="relative"
				centerContent>
				<chakra.section py={8}>
					<Hero />
				</chakra.section>
				<Awards />
			</Container>
			<Container w="full" maxW="full" mx="auto" py={8} centerContent>
				<chakra.section py={16}>
					<Box textAlign="center">
						<Heading as="h1" size="2xl">
							Home
						</Heading>
						<Text fontSize="lg">
							Hier geht&apos;s irgendwann weiter!
						</Text>
					</Box>
				</chakra.section>
			</Container>
		</>
	);
}

export const url = "/";
