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

// eslint-disable-next-line prefer-destructuring -- process.env doesn't have a proper iterator
const CMS_AUTH_SECRET = process.env["CMS_AUTH_SECRET"];

if (!CMS_AUTH_SECRET) {
	throw new Error(
		"API Authorization secret is undefined, server can't handle requests at the moment.",
	);
}

const storage = createCookieSessionStorage({
	cookie: {
		httpOnly: true,
		maxAge: 604800,
		name: "cms_auth",
		path: "/",
		sameSite: process.env.NODE_ENV !== "development" ? "strict" : "none",
		secrets: [CMS_AUTH_SECRET],
		secure: process.env.NODE_ENV !== "development",
	},
});

export async function createUserSession(userId: number, redirectTo: string) {
	const session = await storage.getSession();
	session.set("userId", userId);
	return redirect(redirectTo, {
		headers: { "Set-Cookie": await storage.commitSession(session) },
	});
}

export async function authorizeUserSession(request: Request) {
	const session = await storage.getSession(request.headers.get("Cookie"));
	const userId = session.get("userId") as unknown;
	if (typeof userId !== "number") {
		throw redirect("/login");
	}
	return userId;
}
