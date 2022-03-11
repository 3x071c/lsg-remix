import { useContext } from "react";
import InitialColorModeContext from "./InitialColorModeContext";
import { getInitialColorModeCookie } from "./colorModeCookie";

const isServer = typeof document === "undefined";
const isClient = !isServer;

export default function useInitialColorModeCookie() {
	const initialColorModeContext = useContext(InitialColorModeContext);

	return (
		initialColorModeContext ||
		getInitialColorModeCookie(isClient ? document.cookie : "")
	);
}
