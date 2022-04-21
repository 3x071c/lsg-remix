import type { LoaderFunction } from "remix";
import {
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	Code,
	Kbd,
	Fade,
	Center,
	CircularProgress,
} from "@chakra-ui/react";
import { json, redirect } from "remix";
import { useAuthCallback, authorize } from "~app/auth";
import { url as adminURL } from "~routes/__pages/admin/index";

type LoaderData = Record<string, never>;
const getLoaderData = async (request: Request): Promise<LoaderData> => {
	if (await authorize(request, { required: false })) throw redirect(adminURL);
	return {};
};
export const loader: LoaderFunction = async ({ request }) =>
	json<LoaderData>(await getLoaderData(request));

export default function Callback(): JSX.Element {
	const { data, error, loading } = useAuthCallback();

	if (loading) {
		return (
			<Center minW="100vw" minH="100vh" p={2}>
				<CircularProgress isIndeterminate capIsRound />
			</Center>
		);
	}

	return (
		<Fade in={!loading} unmountOnExit>
			<Alert
				status={data ? "success" : "error"}
				minW="100vw"
				minH="100vh"
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
				p={4}
				textAlign="center">
				<AlertIcon boxSize="40px" mr={0} />
				<AlertTitle mt={4} mb={1} fontSize="lg">
					{data ? "Angemeldet! 💨" : "Ups! 🚨"}
				</AlertTitle>
				<AlertDescription maxW="xl">
					{data
						? ""
						: "Etwas ist schiefgelaufen. Probiere die Anmeldung vielleicht später nochmal."}
				</AlertDescription>
				<AlertDescription maxW="sm" fontSize="sm">
					Dieser Tab kann jetzt geschlossen werden (<Kbd>Strg</Kbd> +{" "}
					<Kbd>W</Kbd>)
				</AlertDescription>
				{error && (
					<AlertDescription maxW="lg">
						<Code d="block" my={2} colorScheme="red" fontSize="sm">
							{String(error)}
						</Code>
					</AlertDescription>
				)}
			</Alert>
		</Fade>
	);
}

export const url = "/callback";
