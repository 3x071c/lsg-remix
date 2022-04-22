import { Magic } from "@magic-sdk/admin";

export default new Magic(
	typeof process.env["MAGIC_SECRET"] === "string"
		? process.env["MAGIC_SECRET"]
		: "",
);
