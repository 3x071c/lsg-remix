import { Center, CircularProgress } from "@chakra-ui/react";
import { useEffect } from "react";
import { json, LoaderFunction } from "remix";
import { authorize, logout as invalidate, useLogin } from "~app/auth";

const getLoaderData = async (request: Request) => {
	if (await authorize(request, { required: false }))
		throw await invalidate(request);
	return {};
};
type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;
export const loader: LoaderFunction = async ({ request }) =>
	json<LoaderData>(await getLoaderData(request));

export default function Logout(): JSX.Element {
	const { logout, loading, data } = useLogin();

	useEffect(() => {
		if (!loading && data) {
			const callback = async () => {
				await logout();
				window.location.replace("/");
			};
			void callback();
		}
		setTimeout(() => {
			window.location.replace("/");
		}, 10000);
	}, [loading, data, logout]);

	return (
		<Center minW="100vw" minH="100vh" p={2}>
			<CircularProgress isIndeterminate capIsRound />
		</Center>
	);
}

export const url = "/admin/logout";
