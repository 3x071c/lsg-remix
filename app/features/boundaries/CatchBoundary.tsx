import {
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	Code,
	Fade,
} from "@chakra-ui/react";

export default function CatchBoundary({
	name,
	message,
}: {
	name: string;
	message: string;
}): JSX.Element {
	return (
		<Fade in>
			<Alert
				status="warning"
				minW="100%"
				minH="100%"
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
				p={4}
				textAlign="center"
				borderRadius="xl">
				<AlertIcon boxSize="40px" mr={0} />
				<AlertTitle mt={4} mb={1} fontSize="lg">
					Hier könnte ihre Werbung stehen 😅
				</AlertTitle>
				<AlertDescription maxW="xl">
					Es gab ein Problem beim Laden der {name}
				</AlertDescription>
				<AlertDescription maxW="lg">
					<Code d="block" my={2} colorScheme="yellow" fontSize="sm">
						{String(message)}
					</Code>
				</AlertDescription>
			</Alert>
		</Fade>
	);
}
