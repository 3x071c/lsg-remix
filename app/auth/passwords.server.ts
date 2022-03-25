import {
	hash,
	verify,
	Options as ArgonOptions,
	argon2id,
	needsRehash,
} from "argon2"; /* secure hashing algorithm */

/**
 * Options for the argon2 hashing algorithm. Don't change unless you know what you're doing.
 */
const argonOptions: ArgonOptions & { raw?: false } = {
	hashLength: 32,
	memoryCost: 4096,
	parallelism: 2,
	saltLength: 16,
	timeCost: 3,
	type: argon2id,
};

/**
 * Hashes a given password using argon2
 * @param password The password to hash
 * @returns A hash of the provided password
 */
export const hashPassword = (password: string) => hash(password, argonOptions);

/**
 * Compares a password with its hash to authenticate
 * @param password The cleartext password to compare
 * @param passwordHash The password hash to compare
 * @returns Boolean indicating if the provided inputs match
 */
export const verifyPassword = (password: string, passwordHash: string) =>
	verify(passwordHash, password, argonOptions);
/**
 * Indicates whether the provided hash is outdated and should be recreated
 * @param passwordHash A password hash
 * @returns Whether the hash should be updated by re-computing its value from cleartext
 */
export const shouldRehashPassword = (passwordHash: string) =>
	needsRehash(passwordHash, argonOptions);

/* Hashing is a one-way process (intentionally). Outputs can't be decoded back to inputs, and can only be compared with the verifyPassword function. This prevents leaking cleartext passwords when data is breached. */
