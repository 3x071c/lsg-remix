import type { ColorMode, StorageManager } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import { ChakraProvider, useColorMode } from "@chakra-ui/react";
import { useEffect } from "react";
import { theme } from "~feat/chakra";
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

function ColorModeManagerChild({
	children,
	initialColorMode,
}: PropsWithChildren<{ initialColorMode?: ColorMode }>): JSX.Element {
	const { colorMode, setColorMode } = useColorMode();

	/* Recompute and set (if necessary) the color mode on the client */
	useEffect(() => {
		const revalidatedColorMode = getColorMode({
			current: colorMode,
			initial: initialColorMode,
		});
		if (colorMode !== revalidatedColorMode)
			setColorMode(revalidatedColorMode);
	}, [colorMode, initialColorMode, setColorMode]);

	// eslint-disable-next-line react/jsx-no-useless-fragment -- Can't return a ReactNode here, because TS is incompetent
	return <>{children}</>;
}

export default function ColorModeManager({
	children,
}: PropsWithChildren<unknown>) {
	const colorModeCookie = useColorModeCookie();

	return (
		<ChakraProvider
			theme={theme}
			colorModeManager={colorModeStorageManager(
				colorModeCookie?.current,
			)}>
			<ColorModeManagerChild initialColorMode={colorModeCookie?.initial}>
				{children}
			</ColorModeManagerChild>
		</ChakraProvider>
	);
}
