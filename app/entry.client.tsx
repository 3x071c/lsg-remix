import { CacheProvider } from "@emotion/react";
import { PropsWithChildren, useMemo, useState } from "react";
import { hydrate } from "react-dom";
import { RemixBrowser } from "remix";
import { createEmotionCache, EmotionClientContext } from "~app/emotion";
import { RemountProvider } from "~app/hooks";

function ClientWrapper({ children }: PropsWithChildren<unknown>) {
	const [cache, setCache] = useState(createEmotionCache());

	const ctx = useMemo(
		() => ({
			reset: () => setCache(createEmotionCache()),
		}),
		[],
	);

	return (
		<RemountProvider>
			<EmotionClientContext.Provider value={ctx}>
				<CacheProvider value={cache}>{children}</CacheProvider>
			</EmotionClientContext.Provider>
		</RemountProvider>
	);
}

hydrate(
	<ClientWrapper>
		<RemixBrowser />
	</ClientWrapper>,
	document,
);
