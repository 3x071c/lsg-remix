import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { hydrate } from "react-dom";
import { RemixBrowser } from "remix";

const cache = createCache({ key: "css" });

hydrate(
	<CacheProvider value={cache}>
		<RemixBrowser />
	</CacheProvider>,
	document.getElementById("__remix"),
);
