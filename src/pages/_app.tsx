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
}

export default function App({
	Component,
	emotionCache = clientSideEmotionCache,
	apolloClient = getApollo(),
	pageProps,
}: AppProps): JSX.Element {
	return (
		<CacheProvider value={emotionCache}>
			<Head>
				<title>LSG</title>
				<meta
					name="viewport"
					content="initial-scale=1, width=device-width"
				/>
			</Head>
			<ChakraProvider theme={theme}>
				<ApolloProvider client={apolloClient}>
					<Component {...pageProps} />
				</ApolloProvider>
			</ChakraProvider>
		</CacheProvider>
	);
}
