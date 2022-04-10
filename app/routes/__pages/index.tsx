import { Heading, Text, chakra, Container } from "@chakra-ui/react";
import { Awards } from "~app/awards";
import { Calendar } from "~app/calendar";
import { Hero } from "~app/hero";
import { Link } from "~app/links";

export default function Index(): JSX.Element {
	return (
		<Container w="full" maxW="7xl" mx="auto" centerContent>
			<chakra.main w="full">
				<chakra.section py={8}>
					<Hero />
					<Awards />
				</chakra.section>
				<chakra.section py={8} textAlign="center">
					<Heading as="h1" size="2xl">
						Aktuelle Termine
					</Heading>
					<Text fontSize="lg">
						Alle demnächst anstehende Termine des
						Louise-Schroeder-Gymnasiums:
					</Text>
					<Calendar />
					<Link href="/">Zu allen Terminen</Link>
				</chakra.section>
			</chakra.main>
		</Container>
	);
}

export const url = "/";
