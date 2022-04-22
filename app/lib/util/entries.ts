/**
 * Like Object.entries, but with actually useful typings
 * @param obj The object to turn into a tuple array (`[key, value][]`)
 * @returns The constructed tuple array from the given object
 */
export const entries = <O>(
	obj: O,
): {
	readonly [K in keyof O]: [K, O[K]];
}[keyof O][] => {
	return Object.entries(obj) as {
		[K in keyof O]: [K, O[K]];
	}[keyof O][];
};
