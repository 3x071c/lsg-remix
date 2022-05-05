import type { DOMPurifyI } from "dompurify";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

declare global {
	interface Window {
		purify: DOMPurifyI | undefined;
	}
}

export const sanitizer =
	window.purify ||
	(window.purify =
		typeof document !== undefined
			? DOMPurify
			: DOMPurify(
					new JSDOM("<!DOCTYPE html>").window as unknown as Window,
			  ));

export const sanitize = (dirty: string) =>
	sanitizer.sanitize(dirty, {
		USE_PROFILES: { html: true },
	});
