import { CacheProvider } from "@emotion/react";
import { PropsWithChildren, useMemo, useState } from "react";
import { hydrate } from "react-dom";
import { RemixBrowser } from "remix";
import { createEmotionCache, EmotionClientContext } from "~app/emotion";

function ClientWrapper({ children }: PropsWithChildren<unknown>) {
	const [cache, setCache] = useState(createEmotionCache());
	const [mounted, setMounted] = useState(false);

	const ctx = useMemo(
		() => ({
			reset: () => {
				if (!mounted) return setMounted(true);
				return setCache(createEmotionCache());
			},
		}),
		[mounted],
	);

	return (
		<EmotionClientContext.Provider value={ctx}>
			<CacheProvider value={cache}>{children}</CacheProvider>
		</EmotionClientContext.Provider>
	);
}

hydrate(
	<ClientWrapper>
		<RemixBrowser />
	</ClientWrapper>,
	document,
);
