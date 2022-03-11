import { useContext } from "react";
import ColorModeContext from "./ColorModeContext";
import { getColorModeCookie } from "./colorModeCookie";

const isServer = typeof document === "undefined";
const isClient = !isServer;

export default function useColorModeCookie() {
	const colorModeContext = useContext(ColorModeContext);

	return (
		colorModeContext || getColorModeCookie(isClient ? document.cookie : "")
	);
}
