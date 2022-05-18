import type { LoaderFunction } from "remix";
import { useCatch } from "remix";
import { authorize } from "~feat/auth";
import {
	InfoBoundary,
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
	const [, headers] = await authorize(request, { schoolib: true });

	return {
		headers,
		status: 200,
	};
};
export const loader: LoaderFunction = async ({ request }) =>
	respond<LoaderData>(await getLoaderData(request));

export default function Schoolib(): JSX.Element {
	return (
		<InfoBoundary
			title="Diese Seite existiert noch nicht 🙅‍♂️"
			message="Pack mit an!"
		/>
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

	return <NestedErrorBoundary message={message} name="Schoolib-Startseite" />;
}
