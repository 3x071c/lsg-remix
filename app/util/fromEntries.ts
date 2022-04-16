// stolen from: https://stackoverflow.com/a/69019874

type EntriesType =
	| [PropertyKey, unknown][]
	| ReadonlyArray<readonly [PropertyKey, unknown]>;

type DeepWritable<O> = {
	-readonly [P in keyof O]: DeepWritable<O[P]>;
};
type UnionToIntersection<U> = (
	U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
	? I
	: never;

type UnionObjectFromArrayOfPairs<E extends EntriesType> =
	DeepWritable<E> extends (infer R)[]
		? R extends [infer key, infer val]
			? { [prop in key & PropertyKey]: val }
			: never
		: never;
type MergeIntersectingObjects<ObjT> = { [key in keyof ObjT]: ObjT[key] };
type EntriesToObject<E extends EntriesType> = MergeIntersectingObjects<
	UnionToIntersection<UnionObjectFromArrayOfPairs<E>>
>;

/**
 * Like Object.fromEntries, but with actually useful typings
 * @param arr The tuple array (`[key, value][]`) to turn into an object
 * @returns Object constructed from the given entries
 */
export const fromEntries = <E extends EntriesType>(
	entries: E,
): EntriesToObject<E> => {
	return Object.fromEntries(entries) as EntriesToObject<E>;
};
