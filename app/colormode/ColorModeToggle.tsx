import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { IconButton, useColorMode } from "@chakra-ui/react";

export default function ColorModeToggle(): JSX.Element {
	const { colorMode, toggleColorMode } = useColorMode();
	const isLight = colorMode === "light";
	const ColorModeIcon = isLight ? MoonIcon : SunIcon;
	return (
		<IconButton
			aria-label={`Toggle ${isLight ? "dark" : "light"} mode`}
			icon={<ColorModeIcon />}
			isRound
			size="lg"
			pos="absolute"
			top="20px"
			right="20px"
			onClick={toggleColorMode}
		/>
	);
}
