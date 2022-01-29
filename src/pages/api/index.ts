/* eslint-disable no-console */
import type { RequestHandler } from "micro";
import type { NextApiHandler } from "next";
import { ApolloServer } from "apollo-server-micro";
import cors from "micro-cors";
import schema from "$schema";
import context from "$graphql/context";
import apiAuth from "$lib/auth";
import prisma from "$lib/prisma";

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
	}
	if (req.session.user) {
		/*
		By default the session.user objects only contains the id
		but usually we need more, especially the permission when deciding
		whether or not the user is authorized to see/content.
		For this reason, when a user is authorized we query the user object
		with all its relations and replace the session.user object with it.
		*/
		const user = await prisma.user.findFirst({
			include: {
				pages: {
					include: {
						page: true,
					},
				},
				permissions: {
					include: {
						assignedBy: true,
						permission: true,
					},
				},
				permissionsAssigned: {
					include: {
						permission: true,
						user: true,
					},
				},
			},
			where: {
				short: req.session.user.short,
			},
		});

		console.log("querying user", user);

		req.session.user = user!;
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

	if (req.method === "OPTIONS") {
		res.end();
		return undefined;
	}

	return apolloServerHandler(req, res);
};
export default cors()(apiAuth(endpoint) as RequestHandler);

export const config = {
	api: {
		bodyParser: false,
	},
};

// based on: https://github.com/prisma/prisma-examples/tree/latest/typescript/graphql-nextjs
