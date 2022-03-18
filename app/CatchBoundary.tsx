import { Center, chakra, Heading, Text } from "@chakra-ui/react";
import { LinkButton } from "~app/links";

export default function CatchBoundary({
	status,
	statusText,
	message,
}: {
	status: number;
	statusText: string;
	message: string;
}): JSX.Element {
	return (
		<Center minW="100vw" minH="100vh">
			<chakra.main maxW="90%" py={8} textAlign="center">
				<Heading as="h1" size="xl">
					{statusText}
				</Heading>
				<Text fontSize="md">Houston, we&apos;ve had a {status}</Text>
				<Text my={2} fontSize="sm">
					{message}
				</Text>
				<LinkButton href="/" variant="link">
					Hier geht&apos;s zurück
				</LinkButton>
			</chakra.main>
		</Center>
	);
}
