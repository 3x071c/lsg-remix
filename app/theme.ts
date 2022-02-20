import {
	extendTheme,
	withDefaultColorScheme,
	ThemeConfig,
} from "@chakra-ui/react";

const config: ThemeConfig = {
	initialColorMode: "system",
};

export default extendTheme(
	{ config },
	withDefaultColorScheme({
		colorScheme: "blue",
	}),
) as {
	config: typeof config;
};
