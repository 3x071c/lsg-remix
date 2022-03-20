import { Heading, Text, Box, chakra, Container } from "@chakra-ui/react";
import { json, LoaderFunction, useLoaderData } from "remix";
import { Hero } from "~app/hero";
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
			<Container w="full" maxW="7xl" mx="auto" py={8} centerContent>
				<Hero />
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
