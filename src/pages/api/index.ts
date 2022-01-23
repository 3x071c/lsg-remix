/* eslint-disable no-console */
import type { RequestHandler } from "micro";
import type { NextApiHandler } from "next";
import { ApolloServer } from "apollo-server-micro";
import cors from "micro-cors";
import schema from "$schema";
import context from "$graphql/context";
import apiAuth from "$lib/auth";

const apolloServer = new ApolloServer({ context, schema });
let apolloServerHandler: NextApiHandler;

// types: https://nextjs.org/docs/basic-features/typescript#api-routes
// headers: https://github.com/vercel/next.js/blob/canary/examples/api-routes-graphql/pages/api/graphql.js
const endpoint: NextApiHandler = async (req, res) => {
	if (!apolloServerHandler) {
		console.log("⚠️ Starting Apollo Server...");
		await apolloServer.start();
		apolloServerHandler = apolloServer.createHandler({
			path: "/api",
		});
		console.log("Server handler started ✅");
	}

	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader(
		"Access-Control-Allow-Origin",
		"https://studio.apollographql.com",
	);
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept",
	);
	res.setHeader("Access-Control-Allow-Methods", "Post");

	return apolloServerHandler(req, res);
};
export default cors()(apiAuth(endpoint) as RequestHandler);

export const config = {
	api: {
		bodyParser: false,
	},
};

// based on: https://github.com/prisma/prisma-examples/tree/latest/typescript/graphql-nextjs
