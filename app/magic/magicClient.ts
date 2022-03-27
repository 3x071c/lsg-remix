import { Magic } from "magic-sdk";

declare global {
	// eslint-disable-next-line no-var, vars-on-top
	var magic: InstanceType<typeof Magic> | undefined;
}

export default global.magic ||
	(global.magic = new Magic(window.env.MAGIC_KEY ?? "", {
		locale: "de",
		testMode: window.env.NODE_ENV === "development",
	}));
