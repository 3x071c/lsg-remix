import { Heading, Text, chakra, Container } from "@chakra-ui/react";
import { maxContentWidth } from "~feat/chakra";
import { LinkButton } from "~feat/links";
import { Hero, Certificates } from "~tree/home";

export default function Index(): JSX.Element {
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
