import type { GraphQLSchema } from "graphql";
import { resolve } from "path";
import {
	makeSchema,
	fieldAuthorizePlugin,
	declarativeWrappingPlugin,
} from "nexus";
import * as types from "$schema/index";

export default makeSchema({
	contextType: {
		export: "Context",
		module: resolve("graphql/context.ts"),
	},
	outputs: {
		schema: resolve("__generated__/schema.graphql"),
		typegen: resolve("node_modules/@types/nexus-typegen/index.d.ts"),
	},
	plugins: [fieldAuthorizePlugin(), declarativeWrappingPlugin()],
	prettierConfig: resolve(".prettierrc.json"),
	shouldExitAfterGenerateArtifacts: process.argv.includes("--nexus-exit"),
	sourceTypes: {
		modules: [
			{
				alias: "prisma",
				module: "@prisma/client",
			},
		],
	},
	types,
}) as unknown as GraphQLSchema;
