/* eslint-disable no-param-reassign, import/no-extraneous-dependencies */
const { resolve } = require("path");
const GlobalsPolyfills =
	require("@esbuild-plugins/node-globals-polyfill").default;
const alias = require("esbuild-plugin-alias");

const { withEsbuildOverride } = require("remix-esbuild-override");

/**
 * Define callbacks for the arguments of withEsbuildOverride.
 * @param option - Default configuration values defined by the remix compiler
 * @param isServer - True for server compilation, false for browser compilation
 * @param isDev - True during development.
 * @return {EsbuildOption} - You must return the updated option
 */
withEsbuildOverride((option, { isServer }) => {
	if (isServer) option.mainFields = ["browser", "module", "main"];

	option.jsxFactory = "jsx";
	option.inject = [resolve("reactShims.ts")];
	option.plugins = [
		GlobalsPolyfills({
			buffer: true,
		}),
		alias({
			"html-tokenize": require.resolve("no-op"),
			multipipe: require.resolve("no-op"),
			through: require.resolve("no-op"),
		}),
		...option.plugins,
	];

	return option;
});

/**
 * @type {import('@remix-run/dev').AppConfig}
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
};
