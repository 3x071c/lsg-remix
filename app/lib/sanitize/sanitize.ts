import type { DOMPurifyI } from "dompurify";
import DOMPurify from "dompurify";
import { serverPurifier } from "./sanitize.server";

declare global {
	// eslint-disable-next-line no-var, vars-on-top
	var purify: DOMPurifyI | undefined;
}

export const sanitizer =
	globalThis.purify ||
	(globalThis.purify =
		typeof document !== "undefined" &&
		typeof window !== "undefined" &&
		DOMPurify.isSupported
			? DOMPurify
			: serverPurifier());

export const sanitize = (dirty: string) =>
	sanitizer.sanitize(dirty, {
		USE_PROFILES: { html: true },
	});
