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
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
				p={4}
				textAlign="center"
				borderRadius="xl">
				<AlertIcon boxSize="40px" mr={0} />
				<AlertTitle mt={4} mb={1} fontSize="lg">
					{statusText}
				</AlertTitle>
				<AlertDescription>
					Houston, we&apos;ve had a {status}: {message}
				</AlertDescription>
				<AlertDescription maxW="lg" my={2}>
					{message}
				</AlertDescription>
			</Alert>
		</Fade>
	);
}
