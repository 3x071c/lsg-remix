import { Magic } from "@magic-sdk/admin";

declare global {
	// eslint-disable-next-line vars-on-top, no-var
	var magicServer: InstanceType<typeof Magic> | undefined;
}

// eslint-disable-next-line no-return-assign
export default () =>
	global.magicServer ||
	(global.magicServer = new Magic(
		typeof global.env["MAGIC_SECRET"] === "string"
			? global.env["MAGIC_SECRET"]
			: "",
	));
