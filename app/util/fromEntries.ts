/**
 * Like Object.fromEntries, but with actually useful typings
 * @param arr The tuple array (`[key, value][]`) to turn into an object
 * @returns Object constructed from the given entries
 */
export default function fromEntries<T>(
	arr: {
		[K in keyof T]: [K, T[K]];
	}[keyof T][],
): T {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any -- This paradoxically allows for stricter typing, see signature
	return Object.fromEntries(arr) as any;
}
