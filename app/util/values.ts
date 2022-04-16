/**
 * Like Object.values, but with actually useful typings
 * @param obj The object to get the values from
 * @returns The constructed values array from the given object
 */
export const values = <O>(obj: O): O[keyof O][] => {
	return Object.values(obj) as O[keyof O][];
};
