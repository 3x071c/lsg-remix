import { useContext } from "react";
import ColorModeContext, { ColorModeContextData } from "./ColorModeContext";
import {
	getColorModeCookie,
	getInitialColorModeCookie,
} from "./colorModeCookie";

const cookies = typeof document !== "undefined" ? document.cookie : "";

export default function useColorModeCookie(): ColorModeContextData {
	const colorModeContext = useContext(ColorModeContext);

	return (
		colorModeContext || {
			current: getColorModeCookie(cookies),
			initial: getInitialColorModeCookie(cookies),
		}
	);
}
