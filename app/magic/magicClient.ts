import { Magic } from "magic-sdk";

declare global {
	interface Window {
		magic: InstanceType<typeof Magic> | undefined;
	}
}

// eslint-disable-next-line no-return-assign -- Far more elegant
export default () =>
	window.magic ||
	(window.magic = new Magic(
		typeof window.env.MAGIC_KEY === "string" ? window.env.MAGIC_KEY : "",
		{
			locale: "de",
			testMode: window.env.NODE_ENV === "development",
		},
	));
