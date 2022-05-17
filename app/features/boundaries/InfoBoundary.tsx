import {
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
} from "@chakra-ui/react";

export function InfoBoundary({
	title,
	message,
}: {
	title: string;
	message: string;
}): JSX.Element {
	return (
		<Alert
			status="info"
			w="100%"
			minH="100%"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			p={4}
			textAlign="center"
			borderRadius="lg">
			<AlertIcon boxSize="40px" mr={0} />
			<AlertTitle mt={4} mb={1} fontSize="lg">
				{title}
			</AlertTitle>
			<AlertDescription maxW="xl">{message}</AlertDescription>
		</Alert>
	);
}
