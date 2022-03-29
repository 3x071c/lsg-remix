import { useCallback, useEffect, useState } from "react";
import { magicClient } from "~app/magic";
import { url as authURL } from "~routes/cms/auth";

export function useLogin() {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<string | null>(null);
	const [error, setError] = useState<unknown | null>(null);
	console.log("[login] render");

	const login = useCallback(
		async (email: string) => {
			console.log("[login] useCallback");
			if (!(data || loading)) {
				console.log("[login] useCallback !data");
				setLoading(true);
				setData(null);
				setError(null);
				try {
					const token = await magicClient().auth.loginWithMagicLink({
						email,
						redirectURI: `${window.location.origin}${authURL}`,
						showUI: true, // TODO: Implement own UI
					});
					console.log("[login] useCallback !data token", token);
					setData(token);
				} catch (e) {
					console.log("[login] useCallback !data error");
					setError(e);
				}
				setLoading(false);
			}
		},
		[data, loading],
	);

	useEffect(() => {
		console.log("[login] useEffect");
		const callback = async () => {
			setLoading(true);
			try {
				if (await magicClient().user.isLoggedIn()) {
					console.log("[login] useEffect isLoggedIn");
					setData(await magicClient().user.getIdToken());
					setError(null);
				}
			} catch (e) {
				console.log("[login] useEffect error");
				setError(e);
			}
			setLoading(false);
		};
		void callback();
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
