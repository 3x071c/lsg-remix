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
