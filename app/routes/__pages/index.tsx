import { Heading, Text, chakra, Container } from "@chakra-ui/react";
import { Certificates } from "~app/certificates";
import { Hero } from "~app/hero";
import { LinkButton } from "~app/links";

export default function Index(): JSX.Element {
	const maxContentWidth = "7xl";

	return (
		<Container w="full" maxW={maxContentWidth} mx="auto" centerContent>
			<chakra.main w="full">
				<chakra.section py={8}>
					<Hero />
				</chakra.section>
				<chakra.section
					py={8}
					borderTopWidth={1}
					borderTopStyle="dashed"
					borderBottomWidth={1}
					borderBottomStyle="dashed">
					<Certificates />
				</chakra.section>
				<chakra.section py={8} textAlign="center">
					<Heading as="h2" size="xl">
						Aktuelle Termine
					</Heading>
					<Text fontSize="lg">
						Alle demnächst anstehenden Termine des
						Louise-Schroeder-Gymnasiums:
					</Text>
					<LinkButton href="/" mt={4}>
						Zu allen Terminen
					</LinkButton>
				</chakra.section>
			</chakra.main>
		</Container>
	);
}

export const url = "/";
