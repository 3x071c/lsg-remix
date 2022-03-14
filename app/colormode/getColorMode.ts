/* Modeled after official documentation: https://chakra-ui.com/docs/styled-system/features/color-mode#behavior-of-colormode */
import type { ColorMode } from "@chakra-ui/react";
import { theme } from "~app/chakra";
import setColorMode from "./setColorMode";

const isServer = typeof document === "undefined";
const isClient = !isServer;

const prefersColorScheme = (scheme: "light" | "dark"): boolean | undefined =>
	window?.matchMedia(`(prefers-color-scheme: ${scheme})`)?.matches;

const getSystemColorMode = (): ColorMode | null => {
	if (isClient && theme.config.useSystemColorMode) {
		const prefersDarkColorScheme = prefersColorScheme("dark");
		if (prefersDarkColorScheme !== undefined)
			return (prefersDarkColorScheme ? "dark" : "light") as ColorMode;
	}
	return null;
};

const getInitialSystemColorMode = (): ColorMode | null => {
	if (isClient && theme.config.initialColorMode === "system") {
		const prefersDarkColorScheme = prefersColorScheme("dark");
		if (prefersDarkColorScheme !== undefined)
			return (prefersDarkColorScheme ? "dark" : "light") as ColorMode;
	}
	return null;
};

const getInitialColorMode = (): ColorMode | null => {
	if (theme.config.initialColorMode === "dark") "dark" as ColorMode;
	if (theme.config.initialColorMode === "light") "light" as ColorMode;
	return null;
};

export default function getColorMode(
	initial?: ColorMode,
	current?: ColorMode,
): ColorMode {
	const systemColorMode = getSystemColorMode();
	if (systemColorMode) {
		if (initial !== systemColorMode)
			return setColorMode(getColorMode(systemColorMode));
		return setColorMode(systemColorMode);
	}
	const initialSystemColorMode = getInitialSystemColorMode();
	if (initialSystemColorMode) {
		if (initial !== initialSystemColorMode)
			return setColorMode(getColorMode(initialSystemColorMode));
		return current || initialSystemColorMode;
	}
	const initialColorMode = getInitialColorMode();
	if (initialColorMode) {
		if (initial !== initialColorMode)
			return setColorMode(getColorMode(initialColorMode));
		return current || initialColorMode;
	}
	if (current) return current;
	return "light" as ColorMode;
}
