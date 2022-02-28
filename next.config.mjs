import withBundleAnalyzer from "@next/bundle-analyzer";
import withPlugins from "next-compose-plugins";
import withPreact from "next-plugin-preact";

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	reactStrictMode: true,
	typescript: {
		ignoreBuildErrors: true,
	},
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default withPlugins(
	[
		withPreact,
		[
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			withBundleAnalyzer({
				enabled: process.env["ANALYZE"] === "true",
			}),
		],
	].filter(Boolean),
	nextConfig,
);
