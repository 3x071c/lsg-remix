import {
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	Code,
	Fade,
} from "@chakra-ui/react";

export default function ErrorBoundary({
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
				minW="100vw"
				minH="100vh"
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
				p={4}
				textAlign="center">
				<AlertIcon boxSize="40px" mr={0} />
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
