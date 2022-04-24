/* Modeled after official documentation: https://chakra-ui.com/docs/styled-system/features/color-mode#behavior-of-colormode */
import type { ColorMode } from "@chakra-ui/react";
import { theme } from "~feat/chakra";
import { setInitialColorModeCookie } from "./colorModeCookie";

/**
 * This little module takes care of computing the color mode to be used based on the theme and stored values
 * By default, chakra-ui would do this for us, but apparently when using Cookie-based storage (instead of the default localStorage, which is incompatible with server side rendering the correct color mode), we'll have to do it ourself.
 * I've refined some details about the default behavior to fully align it with my expectations.
 */

const isServer = typeof document === "undefined";
const isClient = !isServer;

/**
 * Checks if the browser is using a certain color scheme
 * @param scheme Which color scheme to test for
 * @returns If the given `scheme` is preferred by the browser
 */
const prefersColorScheme = (scheme: "light" | "dark"): boolean | undefined =>
	window?.matchMedia(`(prefers-color-scheme: ${scheme})`)?.matches;

/**
 * Always uses the color mode of the client, overriding any other values.
 * NOTE: Since the server can't run media queries on the client directly, this will always be skipped on the server.
 * @returns The system color mode, or null if it doesn't apply (due to theme settings)
 */
const getSystemColorMode = (): ColorMode | null => {
	if (isClient && theme.config.useSystemColorMode) {
		const prefersDarkColorScheme =
			prefersColorScheme(
				"dark",
			); /* Probe for dark mode to prevent false positives */
		if (prefersDarkColorScheme !== undefined)
			return (prefersDarkColorScheme ? "dark" : "light") as ColorMode;
	}
	return null;
};

/**
 * Uses the system color mode of the client if it hasn't been explicitly modified
 * NOTE: Since the server can't run media queries on the client directly, this will always be skipped on the server.
 * @returns The clients color mode, or null if it doesn't apply (due to f.e. client incompatibility)
 */
const getInitialSystemColorMode = (): ColorMode | null => {
	if (isClient && theme.config.initialColorMode === "system") {
		const prefersDarkColorScheme = prefersColorScheme("dark");
		if (prefersDarkColorScheme !== undefined)
			return (prefersDarkColorScheme ? "dark" : "light") as ColorMode;
	}
	return null;
};

/**
 * Uses the light/dark mode color value from the theme configuration, ignoring client preference
 * @returns The theme's explicit color mode setting, or null
 */
const getInitialColorMode = (): ColorMode | null => {
	if (theme.config.initialColorMode === "dark") "dark" as ColorMode;
	if (theme.config.initialColorMode === "light") "light" as ColorMode;
	return null;
};

/**
 * Gets the color mode (light/dark) for chakra-ui
 * @param initial The initial color mode stored to trigger server-side re-evaluation
 * @param current The current color mode set by the client for the server to prerender
 * @returns The color mode to use
 */
export default function getColorMode({
	initial,
	current,
}: {
	initial?: ColorMode;
	current?: ColorMode;
}): ColorMode {
	const systemColorMode = getSystemColorMode();
	if (systemColorMode) return systemColorMode;
	const initialSystemColorMode = getInitialSystemColorMode();
	if (initialSystemColorMode)
		return initial !== initialSystemColorMode || !current
			? setInitialColorModeCookie(initialSystemColorMode)
			: current;
	const initialColorMode = getInitialColorMode();
	if (initialColorMode)
		return initial !== initialColorMode || !current
			? setInitialColorModeCookie(initialColorMode)
			: current;
	if (current) return current;
	return "light" as ColorMode;
}
