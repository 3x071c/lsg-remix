import type { AppPropsType } from "next/dist/shared/lib/utils";
import { getDataFromTree } from "@apollo/client/react/ssr";
import { ColorModeScript } from "@chakra-ui/react";
import createEmotionServer from "@emotion/server/create-instance";
import NextDocument, {
	DocumentContext,
	DocumentInitialProps,
	DocumentProps,
	Head,
	Html,
	Main,
	NextScript,
} from "next/document";
import createEmotionCache from "$app/createEmotionCache";
import theme from "$app/theme";
import getApollo from "$graphql/client";

type ExtendedInitialDocument = {
	apolloState: { [key: string]: unknown };
	emotionStyleTags: JSX.Element[];
};

type ExtendedDocument = ExtendedInitialDocument & {
	__NEXT_DATA__: { [key: string]: unknown };
};

export default class Document extends NextDocument<ExtendedDocument> {
	// Reference: https://gist.github.com/Tylerian/16d48e5850b407ba9e3654e17d334c1e
	constructor(props: DocumentProps & ExtendedDocument) {
		super(props);

		/**
		 * Attach apolloState to the "global" __NEXT_DATA__ so we can populate the ApolloClient cache
		 */
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const { __NEXT_DATA__, apolloState } = props;
		__NEXT_DATA__["apolloState"] = apolloState;
	}

	static override async getInitialProps(
		ctx: DocumentContext & {
			appProps: AppPropsType;
		},
	): Promise<DocumentInitialProps & ExtendedInitialDocument> {
		/* Resolution order

		On the server:
		1. app.getInitialProps
		2. page.getInitialProps
		3. document.getInitialProps
		4. app.render
		5. page.render
		6. document.render

		On the server with error:
		1. document.getInitialProps
		2. app.render
		3. page.render
		4. document.render

		On the client:
		1. app.getInitialProps
		2. page.getInitialProps
		3. app.render
		4. page.render
		*/

		/* start to finish render time during development */
		const startTime = process.env.NODE_ENV === "development" && Date.now();

		const { renderPage } = ctx;

		// You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
		// However, be aware that it can have global side effects.
		const cache = createEmotionCache();
		// eslint-disable-next-line @typescript-eslint/unbound-method
		const { extractCriticalToChunks } = createEmotionServer(cache);

		/**
		 * Initialize and get a reference to ApolloClient, which is saved in a "global" variable.
		 * The same client instance is returned to any other call to `getApollo`, so _app.js gets the same authenticated client to give to ApolloProvider.
		 */
		const apolloClient = getApollo(true);

		ctx.renderPage = () =>
			renderPage({
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				enhanceApp: (App: any) => {
					function CacheComponent(props: AppPropsType) {
						return (
							<App
								emotionCache={cache}
								apolloClient={apolloClient}
								{...props}
							/>
						);
					}
					return CacheComponent;
				},
			});

		/**
		 * Render the page through Apollo's `getDataFromTree` so the cache is populated.
		 * Unfortunately this renders the page twice per request... There may be a way around doing this, but I haven't quite ironed that out yet.
		 */
		await getDataFromTree(
			<ctx.AppTree
				{...ctx.appProps}
				emotionCache={cache}
				apolloClient={apolloClient}
			/>,
		);

		/**
		 * Render the page as normal, but now that ApolloClient is initialized and the cache is full, each query will actually work.
		 */
		const initialProps = await NextDocument.getInitialProps(ctx);

		// This is important. It prevents emotion from rendering invalid HTML.
		// See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
		const emotionStyles = extractCriticalToChunks(initialProps.html);
		const emotionStyleTags = emotionStyles.styles.map((style) => (
			<style
				data-emotion={`${style.key} ${style.ids.join(" ")}`}
				key={style.key}
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={{ __html: style.css }}
			/>
		));

		/**
		 * Extract the cache to pass along to the client so the queries are "hydrated" and don't need to actually request the data again!
		 */
		const apolloState = apolloClient.extract();

		/* Show load times during development */
		if (startTime)
			// eslint-disable-next-line no-console
			console.info(
				`[_document@${new Date().toLocaleTimeString()}] ⏰ render: ${
					Date.now() - startTime
				}ms.`,
			);

		return {
			...initialProps,
			apolloState,
			emotionStyleTags,
		};
	}

	override render(): JSX.Element {
		return (
			<Html lang="de">
				<Head>{this.props.emotionStyleTags}</Head>
				<body>
					<ColorModeScript
						initialColorMode={theme.config.initialColorMode}
					/>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

// based on: https://github.com/mui-org/material-ui/blob/master/examples/nextjs-with-typescript/pages/_document.tsx
