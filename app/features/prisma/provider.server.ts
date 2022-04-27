import { PrismaClient } from "@prisma/client";

declare global {
	// eslint-disable-next-line no-var, vars-on-top
	var prisma: PrismaClient | undefined;
}

// https://pris.ly/d/help/next-js-best-practices
export const prisma =
	global.prisma ||
	(process.env.NODE_ENV !== "development" && new PrismaClient()) ||
	(global.prisma = new PrismaClient({
		errorFormat: "pretty",
		log: ["query", "info", "warn", "error"],
	}));
