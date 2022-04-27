import { useCallback, useEffect, useState } from "react";
import { magicClient } from "./magic";

export function useLogin() {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<string | null>(null);
	const [error, setError] = useState<unknown | null>(null);

	const login = useCallback(
		async (email: string) => {
			if (!(data || loading)) {
				setLoading(true);
				setData(null);
				setError(null);
				try {
					const token = await magicClient.auth.loginWithMagicLink({
						email,
						redirectURI: `${window.location.origin}/callback`,
						showUI: true, // @todo Implement own UI
					});
					setData(token);
				} catch (e) {
					setError(e);
				} finally {
					setLoading(false);
				}
			}
		},
		[data, loading],
	);

	const logout = useCallback(async () => {
		if (!loading && (await magicClient.user.isLoggedIn())) {
			setLoading(true);
			try {
				await magicClient.user.logout();
				setError(null);
				setData(null);
			} finally {
				setLoading(false);
			}
		}
	}, [loading]);

	useEffect(() => {
		const callback = async () => {
			setLoading(true);
			try {
				if (await magicClient.user.isLoggedIn()) {
					setData(await magicClient.user.getIdToken());
					setError(null);
				}
			} catch (e) {
				setError(e);
			} finally {
				setLoading(false);
			}
		};
		void callback();
	}, []);

	return { data, error, loading, login, logout };
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
			} catch (e) {
				setError(e);
			} finally {
				setLoading(false);
			}
		};
		void callback();
	}, []);

	return { data, error, loading };
}
