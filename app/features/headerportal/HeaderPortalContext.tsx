import type { MutableRefObject } from "react";
import { createContext } from "react";

export type HeaderPortalContextData =
	| MutableRefObject<HTMLElement | null>
	| undefined;
/**
 * Stores the current color mode on the server
 */
export const HeaderPortalContext =
	createContext<HeaderPortalContextData>(undefined);
