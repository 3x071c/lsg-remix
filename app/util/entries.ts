/**
 * Like Object.entries, but with actually useful typings
 * @param obj The object to turn into a tuple array (`[key, value][]`)
 * @returns The constructed tuple array from the given object
 */
export default function entries<T>(obj: T): {
	readonly [K in keyof T]: [K, T[K]];
}[keyof T][] {
	return Object.entries(obj) as {
		[K in keyof T]: [K, T[K]];
	}[keyof T][];
}
