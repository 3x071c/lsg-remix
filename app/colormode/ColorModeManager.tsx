import { ChakraProvider, StorageManager, storageKey } from "@chakra-ui/react";
import { useContext, PropsWithChildren } from "react";
import theme from "~app/theme";
import ColorModeContext, { ColorModeContextData } from "./ColorModeContext";

const colorModeStorageManager = (
	mode: ColorModeContextData,
): StorageManager => ({
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
}: PropsWithChildren<unknown>) {
	const colorModeContext = useContext(ColorModeContext);

	return (
		<ChakraProvider
			colorModeManager={colorModeStorageManager(colorModeContext)}>
			{children}
		</ChakraProvider>
	);
}
