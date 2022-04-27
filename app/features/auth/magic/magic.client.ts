import { Magic } from "magic-sdk";

declare global {
	interface Window {
		magicClient: InstanceType<typeof Magic> | undefined;
	}
}

export const magicClient =
	window.magicClient ||
	(window.magicClient = new Magic(
		typeof window.env.MAGIC_KEY === "string" ? window.env.MAGIC_KEY : "",
		{
			locale: "de",
			testMode: window.env.NODE_ENV === "development",
		},
	));
