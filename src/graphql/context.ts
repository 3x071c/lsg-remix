import prisma from "$lib/prisma";

export interface Context {
	prisma: typeof prisma;
}
const context: Context = { prisma };
export default context;
