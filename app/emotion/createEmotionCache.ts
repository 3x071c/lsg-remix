import createCache, { EmotionCache } from "@emotion/cache";

// prepend: true moves vendor styles to the top of <head> so they're loaded first and can easily be overridden by custom CSS
export default function createEmotionCache(): EmotionCache {
	return createCache({ key: "css" });
}
