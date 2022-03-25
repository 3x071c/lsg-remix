export default function fromEntries<T>(
	obj: {
		[K in keyof T]: [K, T[K]];
	}[keyof T][],
): T {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any -- This paradoxically allows for stricter typing, see signature
	return Object.fromEntries(obj) as any;
}
