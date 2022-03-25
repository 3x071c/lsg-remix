import { ColorMode, storageKey as colorModeStorageKey } from "@chakra-ui/react";

/**
 * Gets the value of a cookie from a given string
 * @param cookies An RFC-compliant cookie string as returned by document.cookie
 * @param key The cookie name
 * @returns The cookie value
 */
function parseCookie(cookies: string, key: string) {
	return cookies.match(new RegExp(`(^| )${key}=([^;]+)`))?.[2];
}

/**
 * Sets the value of a cookie via document.cookie
 * 🚨 This only works on the client-side! 🚨
 * @param key The cookie name
 * @param value The cookie value
 * @returns The given `key`
 */
const setCookie = <T extends string>(key: string, value: T): T => {
	if (typeof document === "undefined") return value;
	document.cookie = `${key}=${value}; max-age=604800; path=/`;
	return value;
};

const initialColorModeStorageKey = `${colorModeStorageKey}-initial`;
/**
 * Gets the initial color mode
 * @param cookies The cookie string
 * @returns The initial color mode value, if available
 */
export const getInitialColorModeCookie = (cookies: string) => {
	return parseCookie(cookies, initialColorModeStorageKey) as
		| ColorMode
		| undefined;
};
/**
 * Sets a new initial color mode
 * @param value The new initial color mode
 * @returns The given `value`
 */
export const setInitialColorModeCookie = (value: ColorMode) => {
	return setCookie(initialColorModeStorageKey, value);
};

/**
 * Gets the current color mode
 * @param cookies The cookie string
 * @returns The current color mode value, if available
 */
export const getColorModeCookie = (cookies: string) => {
	return parseCookie(cookies, colorModeStorageKey) as ColorMode | undefined;
};
/**
 * Sets a new current color mode
 * @param value The new current color mode
 * @returns The given `value`
 */
export const setColorModeCookie = (value: ColorMode) => {
	return setCookie(colorModeStorageKey, value);
};
