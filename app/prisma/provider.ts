import { PrismaClient } from "@prisma/client";

declare global {
	// eslint-disable-next-line no-var, vars-on-top
	var prisma: PrismaClient | undefined;
}

// https://pris.ly/d/help/next-js-best-practices
export default global.prisma ||
	(process.env.NODE_ENV !== "development" &&
		new PrismaClient({
			datasources: {
				db: {
					url: process.env["PRISMA_URL"],
				},
			},
		})) ||
	(global.prisma = new PrismaClient({
		errorFormat: "pretty",
		log: ["query", "info", "warn", "error"],
	}));
