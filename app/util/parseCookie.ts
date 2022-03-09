export default (cookies: string, key: string) =>
	cookies.match(new RegExp(`(^| )${key}=([^;]+)`))?.[2];
