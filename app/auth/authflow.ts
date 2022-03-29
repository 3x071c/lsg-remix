import { useCallback, useEffect, useState } from "react";
import { magicClient } from "~app/magic";
import { url as authURL } from "~routes/cms/auth";

export function useLogin() {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<string | null>(null);
	const [error, setError] = useState<unknown | null>(null);

	const login = useCallback(async (email: string) => {
		setLoading(true);
		setData(null);
		setError(null);
		try {
			const token = await magicClient().auth.loginWithMagicLink({
				email,
				redirectURI: `${window.location.origin}${authURL}`,
				showUI: true, // TODO: Implement own UI
			});
			setData(token);
		} catch (e) {
			setError(e);
		}
		setLoading(false);
	}, []);

	return { data, error, loading, login, setLoading };
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
				const token = await magicClient().auth.loginWithCredential();
				setData(token);
			} catch (e) {
				setError(e);
			}
			setLoading(false);
		};
		void callback();
	}, []);

	return { data, error, loading };
}
