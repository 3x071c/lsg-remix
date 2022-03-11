import type { ColorMode } from "@chakra-ui/react";
import { createContext } from "react";

export type ColorModeContextData = ColorMode | null;
const ColorModeContext = createContext<ColorModeContextData>(null);
export default ColorModeContext;
