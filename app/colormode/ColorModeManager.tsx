import type { ColorMode, StorageManager } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import { ChakraProvider, useColorMode } from "@chakra-ui/react";
import debug from "debug";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import Cookie from "js-cookie";
import { useRef, useContext, useEffect } from "react";
import { theme } from "~feat/chakra";
import { ColorModeContext, useRevalidatedColorMode } from ".";

const log = debug("colorModeManager");
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
			log("Determining color mode: %s || %s || %s", cookie, mode, init);
			if (cookie) return cookie === "dark" ? "dark" : "light";
		} else {
			log("Determining color mode: %s || %s", mode, init);
		}
		if (mode) return mode;
		return init;
	},
	set(value) {
		if (isClient) {
			log("Setting color mode to %s", value);
			Cookie.set("colorMode", value, { expires: 365, sameSite: "Lax" });
		} else {
			log("Not setting color mode");
		}
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
	const watchColorModeStorage = useRef(true);
	watchColorModeStorage.current = true;

	log(
		"colorMode (%s) | colorModeStorage (%s) | revalidatedColorMode (%s)",
		colorMode,
		colorModeStorage,
		revalidatedColorMode,
	);

	useEffect(() => {
		log("reload | revalidatedColorMode changed");
		log("Updating colorMode to revalidatedColorMode");
		setColorMode(revalidatedColorMode);
		log("Updating colorModeStorage to revalidatedColorMode");
		setColorModeStorage(revalidatedColorMode); // update the color mode storage to make other tabs sync via the other hook
		watchColorModeStorage.current = false; // prevent the other effect hook from running with bad values
	}, [setColorMode, setColorModeStorage, revalidatedColorMode]);

	/* the other effect hook :D (this one is just there for tab sync - if colorModeStorage changes because of activity in a different tab, then set the colorMode in this tab too) */
	useEffect(() => {
		log(
			"reload | colorModeStorage changed | if %o, skipping.",
			!watchColorModeStorage.current,
		);
		if (colorModeStorage && watchColorModeStorage.current) {
			log("Overwriting colorMode to colorModeStorage");
			setColorMode(colorModeStorage);
		}
	}, [setColorMode, colorModeStorage]);

	// eslint-disable-next-line react/jsx-no-useless-fragment -- Can't return a ReactNode here, because TS is incompetent
	return <>{children}</>;
}

export function ColorModeManager({ children }: PropsWithChildren<unknown>) {
	const colorModeContext = useContext(ColorModeContext);
	const colorMode = isServer ? colorModeContext : undefined;

	return (
		<ChakraProvider
			theme={theme}
			colorModeManager={colorModeStorageManager(colorMode)}>
			<ColorModeManagerChild>{children}</ColorModeManagerChild>
		</ChakraProvider>
	);
}
