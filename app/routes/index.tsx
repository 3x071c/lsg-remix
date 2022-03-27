import { Heading, Text, Box, chakra, Container } from "@chakra-ui/react";
import { json, LoaderFunction, useLoaderData } from "remix";
import { Hero } from "~app/hero";
import { pages, pageGroups } from "~app/models";
import { Navbar } from "~app/nav";
import { fromEntries } from "~app/util";

const getLoaderData = async (env: AppLoadContextEnvType) => {
	const pageGroupEnv = pageGroups(env);
	const pageEnv = pages(env);
	const { data: pageGroupNames } = await pageGroupEnv.listValues("name");
	const { data: pageTitles } = await pageEnv.listValues("title");

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
			const { groupRef } = await pageEnv.getMany(uuid, ["groupRef"]);
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
export const loader: LoaderFunction = async ({ context: { env } }) =>
	json<LoaderData>(await getLoaderData(env as AppLoadContextEnvType));

export default function Index(): JSX.Element {
	const { groupedPages } = useLoaderData<LoaderData>();

	return (
		<>
			<Navbar groupedPages={groupedPages} />
			<Container w="full" maxW="7xl" mx="auto" py={8} centerContent>
				<chakra.section>
					<Hero />
				</chakra.section>
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
