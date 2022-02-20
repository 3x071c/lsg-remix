import { useBreakpointValue } from "@chakra-ui/react";

export function useHeadingSize() {
	return useBreakpointValue({ base: "2xl", md: "3xl" });
}
export function useSubHeadingSize() {
	return useBreakpointValue({ base: "lg", md: "xl" });
}
