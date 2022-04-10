import { Heading, Text, chakra, Container } from "@chakra-ui/react";
import { Awards } from "~app/awards";
import { Hero } from "~app/hero";
import { LinkButton } from "~app/links";

export default function Index(): JSX.Element {
	return (
		<Container w="full" maxW="7xl" mx="auto" centerContent>
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
					<Awards />
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
