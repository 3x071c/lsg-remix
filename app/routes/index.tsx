import { Heading, Center, Text, VStack } from "@chakra-ui/react";
import { Hero } from "~app/hero";
import { Container, useBreakpoints } from "~app/layout";
import { Link } from "~app/links";

export default function Index(): JSX.Element {
	const spacing = useBreakpoints((k, _v, i) => [k, `${(i + 1) ** 2}px`]);

	return (
		<>
			<Hero />
			<Container>
				<Center>
					<VStack spacing={spacing}>
						<Heading as="h1" size="xl">
							Epic Heading 😎
						</Heading>
						<Text fontSize="md">Epic Text 🔫</Text>
						<Link href="/test">Redirect</Link>
					</VStack>
				</Center>
			</Container>
		</>
	);
}
