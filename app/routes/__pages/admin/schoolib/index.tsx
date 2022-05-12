import type { LoaderFunction } from "remix";
import { authorize } from "~feat/auth";
import { InfoBoundary } from "~feat/boundaries";
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
