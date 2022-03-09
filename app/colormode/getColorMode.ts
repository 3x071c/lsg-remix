/* Modeled after official documentation: https://chakra-ui.com/docs/styled-system/features/color-mode#behavior-of-colormode */
import type { ColorModeContextData } from "./ColorModeContext";
import type { ColorMode } from "@chakra-ui/react";
import theme from "~app/theme";
import colorModeFromHeader from "./colorModeFromHeader";
import setColorMode from "./setColorMode";

const isServer = typeof document === "undefined";
const isClient = !isServer;

const prefersColorScheme = (scheme: "light" | "dark"): boolean | undefined =>
	window?.matchMedia(`(prefers-color-scheme: ${scheme})`)?.matches;

const getSystemColorMode = () => {
	if (isClient && theme.config.useSystemColorMode) {
		const prefersDarkColorScheme = prefersColorScheme("dark");
		if (typeof prefersDarkColorScheme !== "undefined")
			return setColorMode(
				(prefersDarkColorScheme ? "dark" : "light") as ColorMode,
			);
	}
	return null;
};

const getClientColorMode = () => {
	if (isClient) {
		const clientColorMode = colorModeFromHeader(document.cookie);
		if (clientColorMode) return setColorMode(clientColorMode as ColorMode);
	}
	return null;
};

const getServerColorMode = (
	serverContext: ColorModeContextData,
	serverLoader?: ColorMode,
) => serverLoader || serverContext;

const getInitialColorMode = () => {
	if (isClient && theme.config.initialColorMode === "system") {
		const prefersDarkColorScheme = prefersColorScheme("dark");
		if (typeof prefersDarkColorScheme !== "undefined")
			return setColorMode(
				(prefersDarkColorScheme ? "dark" : "light") as ColorMode,
			);
	}
	if (theme.config.initialColorMode === "dark") "dark" as ColorMode;
	return "light" as ColorMode;
};

export default function getColorMode(
	serverContext: ColorModeContextData,
	serverLoader?: ColorMode,
): ColorMode {
	const systemColorMode = getSystemColorMode();
	if (systemColorMode) return systemColorMode;
	const serverColorMode = getServerColorMode(serverContext, serverLoader);
	if (serverColorMode) return serverColorMode;
	const clientColorMode = getClientColorMode();
	if (clientColorMode) return clientColorMode;
	return getInitialColorMode();
}
