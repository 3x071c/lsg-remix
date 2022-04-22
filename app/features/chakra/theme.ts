import type { ThemeConfig } from "@chakra-ui/react";
import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

/**
 * This is the chakra-ui theme configuration
 *
 * @see https://chakra-ui.com/docs/styled-system/theming/theme
 */
const config: ThemeConfig = {
	initialColorMode:
		"system" /* Adapt to light/dark mode on the client, fall back to "light" */,
	// useSystemColorMode: true,
};

export const theme = extendTheme(
	{ config },
	withDefaultColorScheme({
		colorScheme: "blue" /* Sets the accent colors of the entire theme */,
	}),
) as {
	config: typeof config;
};

export const maxContentWidth = "7xl";
