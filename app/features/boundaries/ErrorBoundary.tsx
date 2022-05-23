import {
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	Code,
	Fade,
} from "@chakra-ui/react";

export function ErrorBoundary({
	name,
	message,
}: {
	name: string;
	message: string;
}): JSX.Element {
	return (
		<Fade in>
			<Alert
				status="error"
				w="100%"
				minH="100%"
				p={4}
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
				textAlign="center"
				borderRadius="xl">
				<AlertIcon mr={0} boxSize="40px" />
				<AlertTitle mt={4} mb={1} fontSize="lg">
					Hier könnte ihre Werbung stehen 😅
				</AlertTitle>
				<AlertDescription maxW="xl">
					Es gab einen kritischen Fehler beim Laden der {name}
				</AlertDescription>
				<AlertDescription maxW="lg">
					<Code d="block" my={2} colorScheme="red" fontSize="sm">
						{String(message)}
					</Code>
				</AlertDescription>
			</Alert>
		</Fade>
	);
}
