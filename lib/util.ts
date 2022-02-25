export function undefinedOrValue<Type>(
	arg: Type | null | undefined,
): Type | undefined {
	if (arg == null) {
		return undefined;
	}
	return arg;
}
