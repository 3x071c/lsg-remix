import {
	hash,
	verify,
	Options as ArgonOptions,
	argon2id,
	needsRehash,
} from "argon2";

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
