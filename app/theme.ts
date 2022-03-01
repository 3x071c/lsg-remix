import {
	extendTheme,
	withDefaultColorScheme,
	ThemeConfig,
	theme,
} from "@chakra-ui/react";

const config: ThemeConfig = {
	initialColorMode: "light",
};

export default extendTheme(
	{ config },
	{
		colors: {
			brand: theme.colors.purple,
		},
	},
	withDefaultColorScheme({
		colorScheme: "brand",
	}),
) as {
	config: typeof config;
};
