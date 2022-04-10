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
import { Calendar } from "~app/calendar";
import { Hero } from "~app/hero";
import { Link } from "~app/links";
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
				<chakra.section pb={8} pt={4}>
					<Hero />
				</chakra.section>
				<Awards />
			</Container>
			<Container w="full" maxW="full" mx="auto" py={8} centerContent>
				<chakra.section py={16}>
					<Box textAlign="center" mb="8">
						<Heading as="h1" size="2xl">
							Aktuelle Termine
						</Heading>
						<Text fontSize="xl" mt="3">
							Alle demnächst anstehende Termine des
							Louise-Schroeder-Gymnasiums:
						</Text>
					</Box>
					<Calendar />
					<Box textAlign="center" mt="8">
						<Link href="/" color="rgb(0, 119, 255)">
							Zu allen Terminen
						</Link>
					</Box>
				</chakra.section>
			</Container>
		</>
	);
}

export const url = "/";
