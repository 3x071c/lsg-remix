import type { LoaderFunction } from "remix";
import { chakra, Heading, Text } from "@chakra-ui/react";
import { redirect } from "remix";
import { authorize } from "~feat/auth";
import { respond } from "~lib/response";

type LoaderData = {
	headers: HeadersInit;
	status: number;
};
const getLoaderData = async (request: Request): Promise<LoaderData> => {
	const [{ locked }, headers] = await authorize(request, { lock: true });
	if (!locked) throw redirect("/admin");

	return {
		headers,
		status: 200,
	};
};
export const loader: LoaderFunction = async ({ request }) =>
	respond<LoaderData>(await getLoaderData(request));

export default function Locked(): JSX.Element {
	return (
		<chakra.main w="full">
			<Heading as="h1" size="2xl">
				Account ist aktuell gesperrt
			</Heading>
			<Text fontSize="lg" mt={2}>
				Dies kann daran liegen, dass ihr Nutzer suspendiert wurde.
				Außerdem müssen neue Nutzer zuerst intern freigegeben werden,
				bevor auf privilegierte Funktionen zugegriffen werden kann.
				Fragen Sie im Zweifel bei den Administratoren nach, und laden
				Sie die Seite neu.
			</Text>
		</chakra.main>
	);
}
