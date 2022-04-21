import type { AppData } from "remix";
import type { SuperJSONResult } from "superjson/dist/types";
import { useActionData, json, useLoaderData } from "remix";
import { serialize, deserialize } from "superjson";

export const respond = <T extends MakeRequired<ResponseInit, "status">>(
	data: T,
): Response => {
	return json(serialize(data), data);
};

export const useLoaderResponse = <T = AppData>(): T => {
	const response = useLoaderData<SuperJSONResult>();
	return deserialize<T>(response);
};

export const useActionResponse = <T>(): T | undefined => {
	const response = useActionData<SuperJSONResult>();
	if (!response) return undefined;
	return deserialize<T>(response);
};
