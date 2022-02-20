import type { PropsWithChildren } from "react";
import { Box, ChakraProps } from "@chakra-ui/react";
import useBreakpoints from "./useBreakpoints";

export default function Container(props: PropsWithChildren<ChakraProps>) {
	const spacing = useBreakpoints((k, _v, i) => [k, (i + 1) * 2]);

	return <Box {...props} mx="auto" w="full" maxW="7xl" p={spacing} />;
}
