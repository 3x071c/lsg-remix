import { Center, Spinner } from "@chakra-ui/react";

export default function LoadingIndicator(): JSX.Element {
	return (
		<Center w="100%" h="100%">
			<Spinner size="xl" label="Loading webpage content" />
		</Center>
	);
}
