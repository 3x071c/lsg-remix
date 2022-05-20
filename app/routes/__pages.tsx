import type { LoaderFunction } from "remix";
import { Portal } from "@chakra-ui/react";
import { useContext } from "react";
import { Outlet, useCatch } from "remix";
import { authorize } from "~feat/auth";
import {
	ErrorBoundary as NestedErrorBoundary,
	CatchBoundary as NestedCatchBoundary,
} from "~feat/boundaries";
import { HeaderPortalContext } from "~feat/headerportal";
import { Nav } from "~feat/nav";
import { catchMessage } from "~lib/catch";
import { prisma } from "~lib/prisma";
import { respond, useLoaderResponse } from "~lib/response";

type LoaderData = {
	groupedPages: {
		pages: {
			uuid: string;
			title: string;
		}[];
		uuid: string;
		name: string;
	}[];
	headers: HeadersInit;
	isLoggedIn: boolean;
	status: number;
};
const getLoaderData = async (request: Request): Promise<LoaderData> => {
	const [user, headers] = await authorize(request, {
		bypass: true,
		required: false,
	});
	const isLoggedIn = !!user;

	const groupedPages = await prisma.pageCategory.findMany({
		select: {
			name: true,
			pages: {
				select: {
					title: true,
					uuid: true,
				},
			},
			uuid: true,
		},
	});

	return {
		groupedPages,
		headers,
		isLoggedIn,
		status: 200,
	};
};
export const loader: LoaderFunction = async ({ request }) =>
	respond<LoaderData>(await getLoaderData(request));

export default function Pages() {
	const { groupedPages, isLoggedIn } = useLoaderResponse<LoaderData>();
	const headerPortal = useContext(HeaderPortalContext);

	return (
		<>
			<Portal containerRef={headerPortal}>
				<Nav groupedPages={groupedPages} isLoggedIn={isLoggedIn} />
			</Portal>
			<Outlet />
		</>
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

	return <NestedErrorBoundary message={message} name="Seite" />;
}
