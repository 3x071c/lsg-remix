import type { ThemeComponents, ThemeConfig } from "@chakra-ui/react";
import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";
import { withProse } from "@nikolovlazar/chakra-ui-prose";

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
	Text: {
		baseStyle: {
			hyphens: "auto",
			overflowWrap: "break-word",
		},
	},
};

const all = {
	components,
	config,
} as const;

export const theme = extendTheme(
	all,
	withDefaultColorScheme({
		colorScheme: "blue" /* Sets the accent color for the entire theme */,
	}),
	withProse({
		/* The margins in the default prose styles are far too large */
		baseStyle: {
			blockquote: {
				my: { base: 3, md: 4 },
			},
			figure: {
				figcaption: {
					mt: 0,
				},
				my: 4,
			},
			h1: {
				lineHeight: [1.2, null, 1],
				mb: { base: 9, md: 10 },
				mt: 0,
			},
			h2: {
				fontSize: { base: "3xl", md: "4xl" },
				lineHeight: [1.33, null, 1.2],
				mb: { base: 7, md: 8 },
				mt: 0,
			},
			h3: {
				fontSize: { base: "2xl", md: "3xl" },
				lineHeight: [1.33, null, 1.2],
				mb: { base: 5, md: 6 },
				mt: 0,
			},
			h4: {
				fontSize: "xl",
				lineHeight: 1.2,
				mb: { base: 3, md: 4 },
				mt: 0,
			},
			h5: {
				fontSize: "lg",
				lineHeight: 1.2,
				mb: { base: 1, md: 2 },
				mt: 0,
			},
			h6: {
				fontSize: "md",
				lineHeight: 1.2,
				mb: 1,
				mt: 0,
			},
			hr: {
				my: { base: 3, md: 4 },
			},
			li: {
				my: 1,
			},
			p: {
				lineHeight: 1,
				my: 2,
			},
			table: {
				my: 4,
				td: {
					p: { base: 1, md: 2 },
				},
				th: {
					p: { base: 1, md: 2 },
				},
			},
		},
	}),
) as typeof all;
