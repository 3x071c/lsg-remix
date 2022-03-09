import type { ColorMode } from "@chakra-ui/react";
import { ChakraProvider, StorageManager } from "@chakra-ui/react";
import { useContext, PropsWithChildren } from "react";
import theme from "~app/theme";
import ColorModeContext from "./ColorModeContext";
import getColorMode from "./getColorMode";
import setColorMode from "./setColorMode";

const colorModeStorageManager = (mode?: ColorMode): StorageManager => ({
	get(init?) {
		if (mode) return mode;
		return init;
	},
	set(value) {
		setColorMode(value);
	},
	type: "cookie",
});

export default function ColorModeManager({
	children,
	colorMode,
}: PropsWithChildren<{
	colorMode?: ColorMode;
}>) {
	const colorModeContext = useContext(ColorModeContext);

	return (
		<ChakraProvider
			theme={theme}
			colorModeManager={colorModeStorageManager(
				getColorMode(colorModeContext, colorMode),
			)}>
			{children}
		</ChakraProvider>
	);
}
