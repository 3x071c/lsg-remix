import type { Request } from "@remix-run/node";
import {
	hash,
	verify,
	Options as ArgonOptions,
	argon2id,
	needsRehash,
} from "argon2";
import { createCookieSessionStorage, redirect } from "remix";

const argonOptions: ArgonOptions & { raw?: false } = {
	hashLength: 32,
	memoryCost: 4096,
	parallelism: 2,
	saltLength: 16,
	timeCost: 3,
	type: argon2id,
};

export const hashPassword = (password: string) => hash(password, argonOptions);
export const verifyPassword = (password: string, passwordHash: string) =>
	verify(passwordHash, password, argonOptions);
export const shouldRehashPassword = (passwordHash: string) =>
	needsRehash(passwordHash, argonOptions);

const cmsCookieSecret = process.env["CMS_COOKIE_SECRET"];

if (!cmsCookieSecret) {
	throw new Error("Cookie Secret must be set");
}

const storage = createCookieSessionStorage({
	cookie: {
		httpOnly: true,
		maxAge: 604800,
		path: "/",
		sameSite: "strict",
		secrets: [cmsCookieSecret],
		secure: process.env.NODE_ENV === "production",
	},
});

export async function createUserSession(userId: number, redirectTo: string) {
	const session = await storage.getSession();
	session.set("userId", userId);
	return redirect(redirectTo, {
		headers: { "Set-Cookie": await storage.commitSession(session) },
	});
}

export async function requireUserId(request: Request) {
	const session = await storage.getSession(request.headers.get("Cookie"));
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const userId = session.get("userId");
	if (!userId || typeof userId !== "number") {
		throw redirect("/login");
	}
	return userId;
}
