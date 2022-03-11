import { createContext } from "react";

export type EmotionServerContextData =
	| {
			key: string;
			ids: Array<string>;
			css: string;
	  }[]
	| null;
export const EmotionServerContext =
	createContext<EmotionServerContextData>(null);

export type EmotionClientContextData = {
	reset: () => void;
} | null;
export const EmotionClientContext =
	createContext<EmotionClientContextData>(null);
