import { Heading, Text, Box, chakra } from "@chakra-ui/react";
import { json, LoaderFunction, useLoaderData } from "remix";
import { Hero } from "~app/hero";
import { Container } from "~app/layout";
import { Navbar } from "~app/nav";
import { PrismaClient as prisma } from "~app/prisma";

const getLoaderData = () => {
	return prisma.pageCategory.findMany({
		select: {
			id: true,
			name: true,
			pages: {
				select: {
					id: true,
					title: true,
				},
			},
		},
		take: 10,
	});
};
type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;
export const loader: LoaderFunction = async () =>
	json<LoaderData>(await getLoaderData());

export default function Index(): JSX.Element {
	const data = useLoaderData<LoaderData>();

	return (
		<>
			<Navbar data={data} />
			<Container>
				<Hero />
				<chakra.section>
					<Box textAlign="center">
						<Heading as="h1" size="xl">
							Home
						</Heading>
						<Text fontSize="md" mt={2}>
							Insert something interesting here
						</Text>
					</Box>
				</chakra.section>
			</Container>
		</>
	);
}
