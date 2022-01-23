import type { MicroRequest } from "apollo-server-micro/dist/types";
import type { ServerResponse } from "http";
import prisma from "$lib/prisma";

export interface Context {
	prisma: typeof prisma;
	req: MicroRequest;
	res: ServerResponse;
}
export default function context({
	req,
	res,
}: {
	req: MicroRequest;
	res: ServerResponse;
}): Context {
	return { prisma, req, res };
}
