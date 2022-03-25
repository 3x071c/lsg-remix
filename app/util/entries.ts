export default function entries<T>(obj: T): {
	[K in keyof T]: [K, T[K]];
}[keyof T][] {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any -- This paradoxically allows for stricter typing, see signature
	return Object.entries(obj) as any;
}
