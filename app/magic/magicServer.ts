import { Magic } from "@magic-sdk/admin";

export default (env: AppLoadContextEnvType) =>
	new Magic(
		typeof env["MAGIC_SECRET"] === "string" ? env["MAGIC_SECRET"] : "",
	);
