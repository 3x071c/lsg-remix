import { CacheProvider } from "@emotion/react";
import { PropsWithChildren, useMemo, useState } from "react";
import { hydrate } from "react-dom";
import { RemixBrowser } from "remix";
import { createEmotionCache, EmotionClientContext } from "~app/emotion";

function ClientWrapper({ children }: PropsWithChildren<unknown>) {
	const [cache, setCache] = useState(createEmotionCache());
	const ctx = useMemo(
		() => ({ reset: () => setCache(createEmotionCache()) }),
		[],
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
