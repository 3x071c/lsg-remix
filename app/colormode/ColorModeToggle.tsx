import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { IconButton, useColorMode } from "@chakra-ui/react";
import debug from "debug";

const log = debug("colorModeToggle");

export function ColorModeToggle(): JSX.Element {
	const { colorMode, toggleColorMode } = useColorMode();
	const isLight = colorMode === "light";
	const ColorModeIcon = isLight ? MoonIcon : SunIcon;

	log("The page is now being rendered in %s mode", colorMode);

	return (
		<IconButton
			size="lg"
			aria-label={`Toggle ${isLight ? "dark" : "light"} mode`}
			icon={<ColorModeIcon />}
			pos="fixed"
			zIndex={1}
			bottom="0"
			right="0"
			transform="translate(-50%, -50%)" /* Relative instead of fixed positioning 😎 */
			onClick={toggleColorMode}
			isRound
		/>
	);
}
