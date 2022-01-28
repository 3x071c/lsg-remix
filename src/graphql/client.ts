// import type contextType from "$graphql/context";
import type { NEXT_DATA } from "next/dist/shared/lib/utils";
import {
	ApolloClient,
	HttpLink,
	InMemoryCache,
	NormalizedCacheObject,
} from "@apollo/client";
// import { SchemaLink } from "@apollo/client/link/schema";
// import type schemaType from "$schema";

interface ExtendedWindow extends Window {
	__NEXT_DATA__: NEXT_DATA & {
		apolloState: NormalizedCacheObject | undefined;
	};
}
declare let window: ExtendedWindow;

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

const createIsomorphLink = () => {
	// if (typeof window === "undefined") {
	// 	// eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
	// 	const { default: schema } = require("$schema") as {
	// 		default: typeof schemaType;
	// 	};
	// 	// eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
	// 	const { default: context } = require("$graphql/context") as {
	// 		default: typeof contextType;
	// 	};
	// 	return new SchemaLink({ context, schema, validate: true });
	// }
	return new HttpLink({
		credentials: "same-origin",
		uri: "/api",
	});
};

const createClient = () =>
	new ApolloClient({
		/* Restore the cache on the client */
		cache: new InMemoryCache().restore(
			(typeof window !== "undefined" &&
				// eslint-disable-next-line no-underscore-dangle
				window.__NEXT_DATA__.apolloState) ||
				{},
		),

		/* Point to GraphQL API */
		link: createIsomorphLink(),

		/* Enable SSR mode on the server */
		ssrMode: typeof window === "undefined",
	});

export default function getApollo(
	force?: boolean,
): ApolloClient<NormalizedCacheObject> {
	// eslint-disable-next-line no-return-assign
	return (!force && apolloClient) || (apolloClient = createClient());
}
