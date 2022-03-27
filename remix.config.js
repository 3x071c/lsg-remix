/* eslint-disable no-param-reassign, import/no-extraneous-dependencies */
const alias = require("esbuild-plugin-alias");
// eslint-disable-next-line import/no-unresolved -- Hacky Cloudflare Workers workaround
const { resolve } = require("node:path");
const { replaceEsbuild } = require("remix-esbuild-override/dist/replace");

replaceEsbuild();

/**
 * @type {import('remix-esbuild-override').AppConfig}
 */
module.exports = {
	appDirectory: "app",
	assetsBuildDirectory: "public/build",
	cacheDirectory: ".cache",
	devServerBroadcastDelay: 1000,
	devServerPort: 8002,
	ignoredRouteFiles: [".*"],
	publicPath: "/build/",
	server: "./server.js",
	serverBuildPath: "functions/[[path]].js",
	serverBuildTarget: "cloudflare-pages",

	// eslint-disable-next-line sort-keys -- Hacky CF workers workaround at the end
	esbuildOverride: (option, { isServer }) => {
		option.jsxFactory = "jsx";
		option.inject = [resolve(__dirname, "reactShims.ts")];
		option.plugins = [
			alias({
				"html-tokenize": require.resolve("no-op"),
				multipipe: require.resolve("no-op"),
				through: require.resolve("no-op"),
			}),
			...option.plugins,
		];
		if (isServer) option.mainFields = ["browser", "module", "main"];

		return option;
	},
};
