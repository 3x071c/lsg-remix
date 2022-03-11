export default function parseCookie(cookies: string, key: string) {
	return cookies.match(new RegExp(`(^| )${key}=([^;]+)`))?.[2];
}
