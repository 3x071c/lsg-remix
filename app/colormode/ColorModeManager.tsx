import type { ColorMode } from "@chakra-ui/react";
import { ChakraProvider, StorageManager } from "@chakra-ui/react";
import { PropsWithChildren, memo, useMemo } from "react";
import { theme } from "~app/chakra";
import { setColorModeCookie } from "./colorModeCookie";
import getColorMode from "./getColorMode";
import useColorModeCookie from "./useColorModeCookie";

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
