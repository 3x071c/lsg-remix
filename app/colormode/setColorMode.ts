import { ColorMode, storageKey } from "@chakra-ui/react";

const isServer = typeof document === "undefined";

export default (value: ColorMode): ColorMode => {
	if (isServer) throw new Error("Invalid document access, reload page");
	document.cookie = `${storageKey}=${value}; max-age=604800; path=/`;
	return value;
};
