import type { ColorMode } from "@chakra-ui/react";
import { createContext } from "react";

export type ColorModeContextData = ColorMode | null;
export default createContext<ColorModeContextData>(null);
