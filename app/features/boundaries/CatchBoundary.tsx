import {
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	Fade,
} from "@chakra-ui/react";

export function CatchBoundary({
	status,
	statusText,
	message,
}: {
	status: number;
	statusText: string;
	message: string;
}): JSX.Element {
	return (
		<Fade in>
			<Alert
				status="warning"
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
					{statusText}
				</AlertTitle>
				<AlertDescription>
					Houston, we&apos;ve had a {status}
				</AlertDescription>
				<AlertDescription maxW="lg" my={2}>
					{message}
				</AlertDescription>
			</Alert>
		</Fade>
	);
}
