import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { IconButton, useColorMode } from "@chakra-ui/react";
import { memo } from "react";

export default memo(function ColorModeToggle(): JSX.Element {
	const { colorMode, toggleColorMode } = useColorMode();
	const isLight = colorMode === "light";
	const ColorModeIcon = isLight ? MoonIcon : SunIcon;
	return (
		<IconButton
			aria-label={`Toggle ${isLight ? "dark" : "light"} mode`}
			icon={<ColorModeIcon />}
			isRound
			size="lg"
			pos="fixed"
			bottom="0"
			right="0"
			transform="translate(-50%, -50%)" /* Relative instead of fixed positioning 😎 */
			onClick={toggleColorMode}
		/>
	);
});
