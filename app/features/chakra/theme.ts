import type {
	ChakraTheme,
	ThemeComponents,
	ThemeConfig,
} from "@chakra-ui/react";
import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

/**
 * This is the chakra-ui theme configuration
 *
 * @see https://chakra-ui.com/docs/styled-system/theming/theme
 */

// generic configuration
const config: ThemeConfig = {
	initialColorMode:
		"system" /* Adapt to light/dark mode on the client, fall back to "light" */,
	// useSystemColorMode: true,
};

// chakra component style definitions + overrides
const components: ThemeComponents = {
	Link: {
		/* The Link component comes black-on-white by default, which isn't very visually appealing. This adds a couple additional variants to choose from (recommended: "indicating", which replicates the default link look with chakra colors, default: "unstyled" as shipped by chakra). */
		baseStyle: {
			color: "",
		},
		defaultProps: {
			variant: "unstyled",
		},
		variants: {
			browser: {
				color: "revert",
			},

			indicating: {
				_dark: {
					_visited: {
						color: "purple.400",
					},
					color: "blue.400",
				},
				_visited: {
					color: "purple.600",
				},
				color: "blue.600",
			},
			normal: {
				_dark: {
					color: "blue.400",
				},
				color: "blue.600",
			},
			unstyled: {
				color: "inherit",
			},
		},
	},
};

const all: Partial<ChakraTheme> = {
	components,
	config,
};

export const theme = extendTheme(
	all,
	withDefaultColorScheme({
		colorScheme: "blue" /* Sets the accent color for the entire theme */,
	}),
) as {
	config: typeof config;
};

export const maxContentWidth = "7xl";
