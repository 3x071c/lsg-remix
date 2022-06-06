/**
 * Returns a type with all readonly notations removed (traverses recursively on an object)
 */
type DeepWriteable<T> = T extends Readonly<{
	-readonly [K in keyof T]: T[K];
}>
	? {
			-readonly [K in keyof T]: DeepWriteable<T[K]>;
	  }
	: T; /* Make it work with readonly types (this is not strictly necessary) */

type FromEntries<T> = T extends [infer Keys, unknown][]
	? { [K in Keys & PropertyKey]: Extract<T[number], [K, unknown]>[1] }
	: never;

/**
 * Like Object.fromEntries, but with actually useful typings
 * @param arr The tuple array (`[key, value][]`) to turn into an object
 * @returns Object constructed from the given entries
 */
export const fromEntries = <
	E extends
		| [PropertyKey, unknown][]
		| ReadonlyArray<readonly [PropertyKey, unknown]>,
>(
	entries: E,
): FromEntries<DeepWriteable<E>> => {
	return Object.fromEntries(entries) as FromEntries<DeepWriteable<E>>;
};
