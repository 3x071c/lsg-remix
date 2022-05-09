import { LinkIcon } from "@chakra-ui/icons";
import {
	Heading,
	chakra,
	Text,
	SimpleGrid,
	Box,
	Badge,
	Flex,
} from "@chakra-ui/react";
import { LinkButton } from "~feat/links";
import { entries } from "~lib/util";

export const pages: {
	[key: string]: { long: string; short: string; url: string };
} = {
	1: {
		long: "Ticket Management Board",
		short: "Board",
		url: "/admin/lab/board",
	},
	2: { long: "Pizzabestellung", short: "Pizza", url: "/admin/lab/pizza" },
} as const;
export default function Index(): JSX.Element {
	return (
		<chakra.main w="full">
			<Heading as="h1">Ahoi Cäpt&apos;n 😳</Heading>
			<Text>Alle internen Admin Lab Projekte:</Text>
			<SimpleGrid
				spacing="20px"
				minChildWidth="200px"
				mt={8}
				mx="auto"
				placeItems="center">
				{entries(pages)
					.filter(([, { short }]) => short !== "Home")
					.map(([uuid, { long, url }]) => (
						<Box
							key={uuid}
							w="full"
							p="5"
							borderWidth="1px"
							borderRadius="lg">
							<Flex align="baseline">
								<Badge
									borderRadius="full"
									px="2"
									colorScheme="teal">
									Sus
								</Badge>
							</Flex>
							<Text
								my={2}
								fontSize="xl"
								fontWeight="bold"
								lineHeight="tight"
								isTruncated>
								{long}
							</Text>
							<Flex justifyContent="flex-end">
								<LinkButton
									href={url}
									size="xs"
									variant="outline"
									rightIcon={<LinkIcon />}>
									Besuchen
								</LinkButton>
							</Flex>
						</Box>
					))}
			</SimpleGrid>
		</chakra.main>
	);
}
