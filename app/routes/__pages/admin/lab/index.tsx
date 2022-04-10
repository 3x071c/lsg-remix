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
import { LinkButton } from "~app/links";
import { entries } from "~app/util";
import { url as boardURL } from "./board";
import { url as pizzaURL } from "./pizza";
import { url as schoolibURL } from "./schoolib";

export const pages: {
	[key: string]: { long: string; short: string; url: string };
} = {
	1: { long: "Ticket Management Board", short: "Board", url: boardURL },
	2: { long: "Pizzabestellung", short: "Pizza", url: pizzaURL },
	3: {
		long: "Schoolib",
		short: "Schoolib",
		url: schoolibURL,
	},
} as const;
export default function Index(): JSX.Element {
	return (
		<chakra.main w="full">
			<Heading>Ahoi Cäpt&apos;n ඞ😳🥺🫡</Heading>
			<Text>Hier ist euer Abfall in unserem Projektordner verewigt:</Text>
			<SimpleGrid
				spacing="20px"
				minChildWidth="200px"
				mt={8}
				mx="auto"
				placeItems="center">
				{entries(pages)
					.filter(([, { short }]) => short !== "Home")
					.map(([id, { long, url }]) => (
						<Box
							key={id}
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

export const url = "/admin/lab";
