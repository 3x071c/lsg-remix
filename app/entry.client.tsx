import { CacheProvider } from "@emotion/react";
import { hydrate } from "react-dom";
import { RemixBrowser } from "remix";
import { createEmotionCache } from "~app/emotion";

const cache = createEmotionCache();

hydrate(
	<CacheProvider value={cache}>
		<RemixBrowser />
	</CacheProvider>,
	document.getElementById("__remix"),
);
