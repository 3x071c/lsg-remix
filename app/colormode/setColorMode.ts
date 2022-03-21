import type { ColorMode } from "@chakra-ui/react";
import {
	setColorModeCookie,
	setInitialColorModeCookie,
} from "./colorModeCookie";

export default function setColorMode(value: ColorMode): ColorMode {
	return setColorModeCookie(setInitialColorModeCookie(value));
}
