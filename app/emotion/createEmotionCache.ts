import type { EmotionCache } from "@emotion/cache";
import createCache from "@emotion/cache";

/* prepend: true would move vendor styles to the top of <head> so they're loaded first and can easily be overridden by custom CSS.
 * Not used here due to incompatibilities with Remix/React
 */

/**
 * Creates an emotion style cache with a shared key
 * @returns An emotion style cache
 */
export const createEmotionCache = (): EmotionCache => {
	return createCache({ key: "css" });
};
