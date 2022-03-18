import { Center, chakra, Heading, Text, Code } from "@chakra-ui/react";
import { LinkButton } from "~app/links";

export default function ErrorBoundary({ name, message }: Error): JSX.Element {
	return (
		<Center minW="100vw" minH="100vh">
			<chakra.main maxW="90%" py={8} textAlign="center">
				<Heading as="h1" size="xl">
					{name}
				</Heading>
				<Text fontSize="md">
					Ein kritischer Fehler ist aufgetreten.
				</Text>
				<Code d="block" my={2} colorScheme="red" fontSize="sm">
					{message}
				</Code>
				<LinkButton href="/" variant="link">
					Hier geht&apos;s zurück
				</LinkButton>
			</chakra.main>
		</Center>
	);
}
