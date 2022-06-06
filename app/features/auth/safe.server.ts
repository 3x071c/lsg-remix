import type { MagicUserMetadata } from "@magic-sdk/admin";
import { magicServer } from "./magic";

const mockedIssuer = `did:ethr:0x${"0".repeat(40)}`;

/**
 * Validates a Magic token "safely", i.e. this works both in development (with invalid tokens) and production
 * @param token The Magic token
 * @returns Nothing
 */
export function safeValidate(token: string) {
	/* Magic Test Mode in development produces invalid tokens, so skip this step */
	if (process.env.NODE_ENV !== "development") {
		try {
			magicServer.token.validate(
				token,
			); /* 🚨 Important: Make sure the token is valid and **hasn't expired**, before authorizing access to user data! */
		} catch (e) {
			throw new Response("Die Anmeldung ist fehlgeschlagen", {
				status: 400,
				statusText: "Schlechte Anfrage",
			});
		}
	}
	return true;
}

/**
 * Get the DID of the user (in test mode during development, the token is invalid, so this mocks it instead)
 * @param token The Magic token from the client-side
 * @returns A server-side issuer/decentralized ID
 */
export function safeIssuer(token: string) {
	safeValidate(token);
	return process.env.NODE_ENV === "development"
		? mockedIssuer
		: magicServer.token.getIssuer(token);
}

/**
 * Get some user info via Magic (in test mode during development, the issuer is invalid, so this mocks it instead)
 * @param did The issuer/decentralized ID
 * @returns Associated metadata (issuer, email)
 */
export async function safeMetadata(
	did: string,
): Promise<Omit<MagicUserMetadata, "publicAddress" | "oauthProvider">> {
	return process.env.NODE_ENV === "development"
		? {
				email: "test@magic.link",
				issuer: mockedIssuer,
				phoneNumber: "+4900000000000",
		  }
		: magicServer.users.getMetadataByIssuer(did);
}
