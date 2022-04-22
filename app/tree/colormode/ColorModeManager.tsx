import type { ColorMode, StorageManager } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { memo, useMemo } from "react";
import { theme } from "~app/chakra";
import { setColorModeCookie } from "./colorModeCookie";
import getColorMode from "./getColorMode";
import useColorModeCookie from "./useColorModeCookie";

/**
 * Allows chakra to modify the current color mode (f.e. via hooks)
 * @param mode The mode passed as a prop
 * @returns A StorageManager for use with `ChakraProvider`
 */
const colorModeStorageManager = (mode?: ColorMode): StorageManager => ({
	get(init?) {
		if (mode) return mode;
		return init;
	},
	set(value) {
		setColorModeCookie(value);
	},
	type: "cookie",
});

export default memo(function ColorModeManager({
	// eslint-disable-next-line react/prop-types -- False positive
	children,
}: PropsWithChildren<unknown>) {
	const colorModeCookie = useColorModeCookie();
	const colorMode = getColorMode(
		/* Compute the color mode to use */
		colorModeCookie?.initial,
		colorModeCookie?.current,
	);

	const child = useMemo(
		() => (
			<ChakraProvider
				theme={theme}
				colorModeManager={colorModeStorageManager(colorMode)}>
				{children}
			</ChakraProvider>
		),
		[colorMode, children],
	);
	return child;
});
