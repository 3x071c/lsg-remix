import { json } from "remix";
import { serialize } from "superjson";

export const respond = <
	T extends MakeRequired<ResponseInit, "headers" | "status">,
>({
	headers,
	...data
}: T): Response => {
	return json(serialize(data), {
		headers,
		status: data.status,
		statusText: data.statusText,
	});
};
