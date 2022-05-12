import type { AppData } from "remix";
import type { SuperJSONResult } from "superjson/dist/types";
import { useMemo } from "react";
import { useLoaderData } from "remix";
import { deserialize } from "superjson";

export const useLoaderResponse = <T = AppData>(): Omit<T, "headers"> => {
	const response = useLoaderData<SuperJSONResult>();
	return useMemo(() => deserialize<T>(response), [response]);
};
