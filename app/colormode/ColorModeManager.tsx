import type { ColorMode, StorageManager } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import { ChakraProvider, useColorMode } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import Cookie from "js-cookie";
import { useRef, useContext, useEffect } from "react";
import { theme } from "~feat/chakra";
import { ColorModeContext } from "./ColorModeContext";
import { useRevalidatedColorMode } from "./useRevalidatedColorMode";

const isServer = typeof document === "undefined";
const isClient = !isServer;

const colorModeStorageAtom = atomWithStorage<ColorMode | undefined>(
	"colorMode",
	undefined,
);

/**
 * Allows chakra to modify the current color mode (f.e. via hooks)
 * @param mode The mode passed as a prop
 * @returns A StorageManager for use with `ChakraProvider`
 */
const colorModeStorageManager = (mode?: ColorMode): StorageManager => ({
	get(init?) {
		if (isClient) {
			const cookie = Cookie.get("colorMode");
			if (cookie) return cookie as ColorMode;
		}
		if (mode) return mode;
		return init;
	},
	set(value) {
		if (isClient)
			Cookie.set("colorMode", value, { expires: 365, sameSite: "Lax" });
	},
	type: "cookie",
});

function ColorModeManagerChild({
	children,
}: PropsWithChildren<unknown>): JSX.Element {
	const [colorModeStorage, setColorModeStorage] =
		useAtom(colorModeStorageAtom);
	const { colorMode, setColorMode } = useColorMode();
	const revalidatedColorMode = useRevalidatedColorMode(colorMode);
	const skipRun = useRef(false);
	skipRun.current = false;

	useEffect(() => {
		if (revalidatedColorMode !== colorMode)
			setColorMode(revalidatedColorMode);
	}, [colorMode, setColorMode, setColorModeStorage, revalidatedColorMode]);

	useEffect(() => {
		if (colorModeStorage) {
			setColorMode(colorModeStorage);
			skipRun.current = true;
		}
	}, [setColorMode, colorModeStorage]);

	useEffect(() => {
		// prevent infinite loop when colorModeStorage and colorMode/revalidatedColorMode set each other because of different values -> prioritize colorModeStorage, skip running this useEffect hook
		if (!skipRun.current) setColorModeStorage(revalidatedColorMode);
	}, [setColorModeStorage, revalidatedColorMode]);

	// eslint-disable-next-line react/jsx-no-useless-fragment -- Can't return a ReactNode here, because TS is incompetent
	return <>{children}</>;
}

export function ColorModeManager({ children }: PropsWithChildren<unknown>) {
	const colorModeContext = useContext(ColorModeContext);
	const colorMode = isClient
		? (Cookie.get("colorMode") as ColorMode | undefined)
		: colorModeContext;

	return (
		<ChakraProvider
			theme={theme}
			colorModeManager={colorModeStorageManager(colorMode)}>
			<ColorModeManagerChild>{children}</ColorModeManagerChild>
		</ChakraProvider>
	);
}
