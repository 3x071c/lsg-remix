import type { Column } from "react-table";
import type { LoaderFunction } from "remix";
import { WarningTwoIcon } from "@chakra-ui/icons";
import { Heading, Container, useToast } from "@chakra-ui/react";
import { useMemo } from "react";
import { useCatch } from "remix";
import { authorize } from "~feat/auth";
import {
	CatchBoundary as NestedCatchBoundary,
	ErrorBoundary as NestedErrorBoundary,
} from "~feat/boundaries";
import { maxContentWidth } from "~feat/chakra";
import { Table } from "~feat/table";
import { catchMessage } from "~lib/catch";
import { prisma } from "~lib/prisma";
import { respond, useLoaderResponse } from "~lib/response";

type TableType = {
	startsAt: Date;
	endsAt: Date;
	title: string;
};

type LoaderData = {
	did?: string;
	events: TableType[];
	headers: HeadersInit;
	status: number;
};
const getLoaderData = async (request: Request): Promise<LoaderData> => {
	const [user, headers] = await authorize(request, {
		bypass: true,
		required: false,
	});

	const events = await prisma.event.findMany({
		orderBy: {
			startsAt: "asc",
		},
		select: {
			endsAt: true,
			startsAt: true,
			title: true,
		},
		where: {
			startsAt: {
				gte: new Date(),
			},
		},
	});

	return { did: user?.did, events, headers, status: 200 };
};
export const loader: LoaderFunction = async ({ request }) =>
	respond<LoaderData>(await getLoaderData(request));

export default function Events() {
	const { did, events } = useLoaderResponse<LoaderData>();
	const toast = useToast();

	const memoizedWarningIcon = useMemo(() => <WarningTwoIcon />, []);
	const dateOpts = useMemo(
		() =>
			({
				day: "numeric",
				dayPeriod: "short",
				month: "numeric",
				year: "2-digit",
			} as const),
		[],
	);
	const columns = useMemo<Column<TableType>[]>(
		() => [
			{
				accessor: "title",
				Cell: ({ value }) => value || memoizedWarningIcon,
				Header: "Titel",
			},
			{
				accessor: "startsAt",
				Cell: ({ value }) =>
					new Date(value).toLocaleString("de", dateOpts),
				disableGlobalFilter: true,
				Header: "Von",
			},
			{
				accessor: "endsAt",
				Cell: ({ value }) =>
					new Date(value).toLocaleString("de", dateOpts),
				disableGlobalFilter: true,
				Header: "Bis",
			},
		],
		[dateOpts, memoizedWarningIcon],
	);

	return (
		<Container w="full" maxW={maxContentWidth} p={4} mx="auto" mt={16}>
			<Heading as="h1" size="2xl" borderBottomWidth={2}>
				Termine
			</Heading>
			<Table
				columns={columns}
				data={events}
				heading="Alle Termine:"
				trigger={
					did
						? () =>
								toast({
									description: `Aktuell nicht implementiert`,
									duration: 3000,
									isClosable: false,
									status: "error",
									title: "Nicht implementiert",
								})
						: undefined
				}
			/>
		</Container>
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

	return <NestedErrorBoundary message={message} name="Termine" />;
}
