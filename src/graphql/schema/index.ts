import { resolve } from "path";
import { makeSchema, fieldAuthorizePlugin } from "nexus";
import * as Page from "./Page";

export default makeSchema({
	contextType: {
		export: "Context",
		module: resolve("src/graphql/context.ts"),
	},
	outputs: {
		schema: resolve("__generated__/schema.graphql"),
		typegen: resolve("node_modules/@types/nexus-typegen/index.d.ts"),
	},
	plugins: [fieldAuthorizePlugin()],
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
	types: { ...Page },
});
