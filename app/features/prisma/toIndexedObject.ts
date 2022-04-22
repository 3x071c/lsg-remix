import { fromEntries } from "~lib/util";

export const toIndexedObject = <I extends { id: number }>(arr: I[]) => {
	return fromEntries(arr.map(({ id, ...rest }) => [id, rest] as const));
};
