import { useTheme } from "@chakra-ui/react";

export default function useBreakpoints<T>(
	fn: (k: string, v: string, i: number) => [string, T],
) {
	const theme = useTheme();

	return Object.fromEntries(
		Object.entries(theme["breakpoints"] as string[]).map(([k, v], i) =>
			fn(k, v, i),
		),
	);
}
