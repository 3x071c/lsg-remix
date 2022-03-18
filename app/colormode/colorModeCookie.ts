import { ColorMode, storageKey as colorModeStorageKey } from "@chakra-ui/react";

function parseCookie(cookies: string, key: string) {
	return cookies.match(new RegExp(`(^| )${key}=([^;]+)`))?.[2];
}

const setCookie = <T extends string>(key: string, value: T): T => {
	if (typeof document === "undefined") return value;
	document.cookie = `${key}=${value}; max-age=604800; path=/`;
	return value;
};

const initialColorModeStorageKey = `${colorModeStorageKey}-initial`;
export const getInitialColorModeCookie = (cookies: string) => {
	return parseCookie(cookies, initialColorModeStorageKey) as
		| ColorMode
		| undefined;
};
export const setInitialColorModeCookie = (value: ColorMode) => {
	return setCookie(initialColorModeStorageKey, value);
};

export const getColorModeCookie = (cookies: string) => {
	return parseCookie(cookies, colorModeStorageKey) as ColorMode | undefined;
};
export const setColorModeCookie = (value: ColorMode) => {
	return setCookie(colorModeStorageKey, value);
};
