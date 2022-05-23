import type { LoaderFunction } from "remix";
import { chakra, Heading, Text } from "@chakra-ui/react";
import { redirect, useCatch } from "remix";
import { authorize } from "~feat/auth";
import {
	CatchBoundary as NestedCatchBoundary,
	ErrorBoundary as NestedErrorBoundary,
} from "~feat/boundaries";
import { catchMessage } from "~lib/catch";
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
			<Text mt={2} fontSize="lg">
				Dies kann daran liegen, dass ihr Nutzer suspendiert wurde.
				Außerdem müssen neue Nutzer zuerst intern freigegeben werden,
				bevor auf privilegierte Funktionen zugegriffen werden kann.
				Fragen Sie im Zweifel bei den Administratoren nach, und laden
				Sie die Seite neu.
			</Text>
		</chakra.main>
	);
}

export function CatchBoundary(): JSX.Element {
	const caught = useCatch();
	// eslint-disable-next-line no-console -- Log the caught message
	console.error("⚠️ Caught:", caught);
	const { status, statusText } = caught;
	const message = catchMessage(status);

	return (
		<NestedCatchBoundary
			message={message}
			status={status}
			statusText={statusText}
		/>
	);
}

export function ErrorBoundary({ error }: { error: Error }): JSX.Element {
	// eslint-disable-next-line no-console -- Log the error message
	console.error("🚨 ERROR:", error);
	const { message } = error;

	return <NestedErrorBoundary message={message} name="Sperrung" />;
}
