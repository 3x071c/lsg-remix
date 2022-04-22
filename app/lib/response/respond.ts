import { json } from "remix";
import { serialize } from "superjson";

export const respond = <T extends MakeRequired<ResponseInit, "status">>(
	data: T,
): Response => {
	return json(serialize(data), data);
};
