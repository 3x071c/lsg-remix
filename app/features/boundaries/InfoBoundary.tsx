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
			p={4}
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			textAlign="center"
			borderRadius="lg">
			<AlertIcon mr={0} boxSize="40px" />
			<AlertTitle mt={4} mb={1} fontSize="lg">
				{title}
			</AlertTitle>
			<AlertDescription maxW="xl">{message}</AlertDescription>
		</Alert>
	);
}
