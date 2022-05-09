import { fromEntries } from "~lib/util";

export const toIndexedObject = <I extends { uuid: string }>(arr: I[]) => {
	return fromEntries(arr.map(({ uuid, ...rest }) => [uuid, rest] as const));
};
