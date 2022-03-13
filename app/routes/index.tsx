import { DeleteIcon } from "@chakra-ui/icons";
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
import { Hero } from "~app/hero";
import { Container } from "~app/layout";
import { PrismaClient as prisma } from "~app/prisma";

const getLoaderData = () => {
	return prisma.page.findMany({
		select: {
			id: true,
			title: true,
		},
		take: 10,
	});
};
type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;
export const loader: LoaderFunction = async () =>
	json<LoaderData>(await getLoaderData());

export default function Index(): JSX.Element {
	const pages = useLoaderData<LoaderData>();

	return (
		<Container>
			<Hero />
			<chakra.section>
				<Box textAlign="center">
					<Heading as="h1" size="xl">
						Beispiel
					</Heading>
					<Text fontSize="md" mt={2}>
						Enjoy yourself!
					</Text>
				</Box>
				<SimpleGrid
					spacing="20px"
					minChildWidth="200px"
					mt={8}
					mx="auto"
					placeItems="center">
					{pages.map((page) => (
						<Box p="5" borderWidth="1px" w="full" key={page.id}>
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
									ID &bull; #{page.id}
								</Text>
							</Flex>
							<Text
								my={2}
								fontSize="xl"
								fontWeight="bold"
								lineHeight="tight"
								isTruncated>
								{page.title}
							</Text>
							<Flex justifyContent="flex-end">
								<Button
									size="xs"
									variant="outline"
									colorScheme="red"
									rightIcon={<DeleteIcon />}>
									Delete
								</Button>
							</Flex>
						</Box>
					))}
				</SimpleGrid>
			</chakra.section>
		</Container>
	);
}
