/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
	appDirectory: "app",
	assetsBuildDirectory: "public/build",
	cacheDirectory: ".remix/cache",
	devServerBroadcastDelay: 1000,
	devServerPort: 8002,
	ignoredRouteFiles: [".*"],
	publicPath: "/build/",
	server: process.env.NODE_ENV !== "development" ? "./server.js" : undefined,
	serverBuildPath: ".remix/server.js",
	serverBuildTarget: "vercel",
};
