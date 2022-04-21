import type { AppData } from "remix";
import type { SuperJSONResult } from "superjson/dist/types";
import { useMemo } from "react";
import { useActionData, json, useLoaderData } from "remix";
import { serialize, deserialize } from "superjson";

export const respond = <T extends MakeRequired<ResponseInit, "status">>(
	data: T,
): Response => {
	return json(serialize(data), data);
};

export const useLoaderResponse = <T = AppData>(): T => {
	const response = useLoaderData<SuperJSONResult>();
	return useMemo(() => deserialize<T>(response), [response]);
};

export const useActionResponse = <T>(): T | Record<string, never> => {
	const response = useActionData<SuperJSONResult>();
	return useMemo(() => deserialize<T>(response ?? { json: {} }), [response]);
};
