import type { ColorMode } from "@chakra-ui/react";
import {
	setColorModeCookie,
	setInitialColorModeCookie,
} from "./colorModeCookie";

/**
 * Sets a value as both the initial and current color mode
 * @param value The color mode value to set
 * @returns The given `value`
 */
export default function setColorMode(value: ColorMode): ColorMode {
	return setColorModeCookie(setInitialColorModeCookie(value));
}
