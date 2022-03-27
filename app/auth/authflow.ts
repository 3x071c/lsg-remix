import { useEffect, useState } from "react";
import { redirect } from "remix";
import { magicClient } from "~app/magic";
import { url as redirectURI } from "~routes/cms/auth";
import { url as cmsURL } from "~routes/cms/index";

/**
 * Initiates the magic login process
 * @param email User E-Mail
 * @returns Decentralized ID token
 */
export async function login(email: string) {
	if (await magicClient.user.isLoggedIn()) throw redirect(cmsURL);
	await magicClient.auth.loginWithMagicLink({
		email,
		redirectURI,
	});
	/* Session creation call here */
}

/**
 * Hook to use on the `redirectURI` callback page
 * @returns A `{data, error, loading}` object containing the DID, an error message or loading indicator
 */
export function useAuthCallback() {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<string | null>(null);
	const [error, setError] = useState<unknown | null>(null);
	useEffect(() => {
		const callback = async () => {
			try {
				const token = await magicClient.auth.loginWithCredential();
				setData(token);
				setLoading(false);
			} catch (e) {
				setError(e);
				setLoading(false);
			}
		};
		void callback();
	}, []);
	return { data, error, loading };
}
