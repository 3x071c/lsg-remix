export default function isExternal(url: string): boolean {
	// RFC 3986 URI regex: https://datatracker.ietf.org/doc/html/rfc3986#appendix-B
	const match = url.match(
		/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/,
	);
	// scheme    = $2
	// authority = $4
	// path      = $5
	// query     = $7
	// fragment  = $9
	if (match?.[4]) return true; // if the URI isn't relative, it's external
	return false;
}
