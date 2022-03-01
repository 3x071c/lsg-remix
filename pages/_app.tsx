import type { Page } from "$types/page";
import type { AppProps as NextAppProps } from "next/app";
import { ApolloClient, ApolloProvider } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import { CacheProvider, EmotionCache } from "@emotion/react";
import Head from "next/head";
import createEmotionCache from "$app/createEmotionCache";
import theme from "$app/theme";
import getApollo from "$graphql/client";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface AppProps extends NextAppProps {
	emotionCache?: EmotionCache;
	apolloClient?: ApolloClient<object>;
	Component: Page;
}

export default function App({
	Component,
	emotionCache = clientSideEmotionCache,
	apolloClient = getApollo(),
	pageProps,
}: AppProps): JSX.Element {
	const getLayout = Component.getLayout ?? ((page) => page);

	return (
		<CacheProvider value={emotionCache}>
			<Head>
				<title>LSG</title>
				<meta
					name="viewport"
					content="initial-scale=1, width=device-width"
				/>
			</Head>
			<ApolloProvider client={apolloClient}>
				<ChakraProvider theme={theme}>
					{getLayout(<Component {...pageProps} />)}
				</ChakraProvider>
			</ApolloProvider>
		</CacheProvider>
	);
}
