import {
	Heading,
	Text,
	chakra,
	Container,
	useColorModeValue,
} from "@chakra-ui/react";
import { maxContentWidth } from "~feat/chakra";
import { Hero, Certificates } from "~feat/home";
import { LinkButton } from "~feat/links";

export default function Index(): JSX.Element {
	const subtleColor = useColorModeValue("gray.600", "gray.400");

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
					<Text
						py={2}
						fontSize="lg"
						textAlign="center"
						color={subtleColor}>
						Referenzschule der TU München
					</Text>
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
