import type { ColorMode } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import { ChakraProvider, StorageManager } from "@chakra-ui/react";
import { theme } from "~app/chakra";
import { setColorModeCookie } from "./colorModeCookie";
import getColorMode from "./getColorMode";
import useColorModeCookie from "./useColorModeCookie";
import useInitialColorModeCookie from "./useInitialColorModeCookie";

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

export default function ColorModeManager({
	children,
}: PropsWithChildren<unknown>) {
	const initialColorModeCookie = useInitialColorModeCookie();
	const colorModeCookie = useColorModeCookie();
	const colorMode = getColorMode(initialColorModeCookie, colorModeCookie);

	return (
		<ChakraProvider
			theme={theme}
			colorModeManager={colorModeStorageManager(colorMode)}>
			{children}
		</ChakraProvider>
	);
}
