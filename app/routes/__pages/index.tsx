import { Heading, Text, Box, chakra, Container } from "@chakra-ui/react";
import { Hero } from "~app/hero";

export default function Index(): JSX.Element {
	return (
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
	);
}

export const url = "/";
