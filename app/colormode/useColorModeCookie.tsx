import { useContext } from "react";
import ColorModeContext, { ColorModeContextData } from "./ColorModeContext";
import {
	getColorModeCookie,
	getInitialColorModeCookie,
} from "./colorModeCookie";

const cookies = typeof document !== "undefined" ? document.cookie : "";

/**
 * Gets the current color mode either from the servers context or the clients document.cookie storage
 * @returns The stored color mode values
 */
export default function useColorModeCookie(): ColorModeContextData {
	const colorModeContext = useContext(ColorModeContext);

	return (
		colorModeContext || {
			current: getColorModeCookie(cookies),
			initial: getInitialColorModeCookie(cookies),
		}
	);
}
