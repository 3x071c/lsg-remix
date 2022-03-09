import type { ColorMode } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import { ChakraProvider, StorageManager, storageKey } from "@chakra-ui/react";
import theme from "~app/theme";

const colorModeStorageManager = (mode?: ColorMode): StorageManager => ({
	get(init?) {
		console.log("[colorModeStorageManager]", init, mode);
		if (mode) {
			console.log("[colorModeStorageManager] mode", mode);
			return mode;
		}
		return init;
	},
	set(value) {
		document.cookie = `${storageKey}=${value}; max-age=604800; path=/`;
	},
	type: "cookie",
});

export default function ColorModeManager({
	children,
	colorMode,
}: PropsWithChildren<{
	colorMode?: ColorMode;
}>) {
	return (
		<ChakraProvider
			theme={theme}
			colorModeManager={colorModeStorageManager(colorMode)}>
			{children}
		</ChakraProvider>
	);
}
