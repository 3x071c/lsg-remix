/**
 * Like Object.keys, but with actually useful typings
 * @param obj The object to get the keys from
 * @returns The constructed keys array from the given object
 */
export const keys = <O>(obj: O): (keyof O)[] => {
	return Object.keys(obj) as (keyof O)[];
};
