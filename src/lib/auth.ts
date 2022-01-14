import type { IronSessionOptions } from "iron-session";
import type { NextApiHandler } from "next";
import { withIronSessionApiRoute } from "iron-session/next";

/* Security check */
if (!process.env["API_AUTH_SECRET"])
	throw new Error("[$lib/auth] !!! NO API_AUTH_SECRET DEFINED !!!");

const config: IronSessionOptions = {
	cookieName: "cms_auth",
	cookieOptions: {
		sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
		secure: process.env.NODE_ENV === "production",
	},
	password: {
		1: process.env["API_AUTH_SECRET"],
	},
};

export default function apiAuth(
	handler: Parameters<typeof withIronSessionApiRoute>[0],
): NextApiHandler {
	return process.env["API_AUTH_SECRET"]
		? withIronSessionApiRoute(handler, config)
		: (_req, res) =>
				res.status(500).send({
					errors: [
						{
							message:
								"API Authorization secret is undefined, server can't handle requests at the moment.",
						},
					],
				});
}
