import type { ColorMode } from "@chakra-ui/react";
import { createContext } from "react";

export type InitialColorModeContextData = ColorMode | null;
const InitialColorModeContext =
	createContext<InitialColorModeContextData>(null);
export default InitialColorModeContext;
