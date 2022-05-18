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
import { redirect } from "remix";
import { useAuthCallback, authorize } from "~feat/auth";
import { respond } from "~lib/response";

type LoaderData = { headers: HeadersInit; status: number };
const getLoaderData = async (request: Request): Promise<LoaderData> => {
	const [user, headers] = await authorize(request, { required: false });
	if (user) throw redirect("/admin");
	return { headers, status: 200 };
};
export const loader: LoaderFunction = async ({ request }) =>
	respond<LoaderData>(await getLoaderData(request));

export default function Callback(): JSX.Element {
	const { data, error, loading } = useAuthCallback();

	if (loading) {
		return (
			<Center w="100%" minH="100%" p={2}>
				<CircularProgress isIndeterminate capIsRound />
			</Center>
		);
	}

	return (
		<Fade in={!loading} unmountOnExit>
			<Alert
				status={data ? "success" : "error"}
				w="100%"
				minH="100%"
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
