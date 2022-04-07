/**
 * Like Object.fromEntries, but with actually useful typings
 * @param arr The tuple array (`[key, value][]`) to turn into an object
 * @returns Object constructed from the given entries
 */
export default function fromEntries<
	T,
	E extends readonly (readonly [PropertyKey, T])[],
>(entries: E): { readonly [key: string]: E[number][1] } {
	return Object.fromEntries(entries);
}
