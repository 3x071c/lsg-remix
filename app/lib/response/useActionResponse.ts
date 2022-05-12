import type { SuperJSONResult } from "superjson/dist/types";
import { useMemo } from "react";
import { useActionData } from "remix";
import { deserialize } from "superjson";

export const useActionResponse = <T>():
	| Omit<T, "headers">
	| Record<string, never> => {
	const response = useActionData<SuperJSONResult>();
	return useMemo(() => deserialize<T>(response ?? { json: {} }), [response]);
};
