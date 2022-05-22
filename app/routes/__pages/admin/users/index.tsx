import type { Column } from "react-table";
import type { LoaderFunction } from "remix";
import { LockIcon, SettingsIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { Heading, chakra, Text, useToast } from "@chakra-ui/react";
import { DateTime } from "luxon";
import { useCallback, useMemo } from "react";
import { useCatch } from "remix";
import { authorize } from "~feat/auth";
import {
	CatchBoundary as NestedCatchBoundary,
	ErrorBoundary as NestedErrorBoundary,
} from "~feat/boundaries";
import { LinkIconButton } from "~feat/links";
import { Table } from "~feat/table";
import { catchMessage } from "~lib/catch";
import { locale } from "~lib/globals";
import { prisma } from "~lib/prisma";
import { respond, useLoaderResponse } from "~lib/response";

type TableType = {
	createdAt: Date;
	did: string;
	email: string;
	firstname: string;
	lastname: string;
	locked: boolean;
	updatedAt: Date;
};

type LoaderData = {
	headers: HeadersInit;
	status: number;
	users: TableType[];
};
const getLoaderData = async (request: Request): Promise<LoaderData> => {
	const [, headers] = await authorize(request, { did: "*" });

	const users = await prisma.user.findMany({
		select: {
			createdAt: true,
			did: true,
			email: true,
			firstname: true,
			lastname: true,
			locked: true,
			updatedAt: true,
		},
	});

	return {
		headers,
		status: 200,
		users,
	};
};
export const loader: LoaderFunction = async ({ request }) =>
	respond<LoaderData>(await getLoaderData(request));

export default function Users() {
	const { users } = useLoaderResponse<LoaderData>();

	const memoizedLockIcon = useMemo(() => <LockIcon />, []);
	const memoizedWarningIcon = useMemo(() => <WarningTwoIcon />, []);
	const memoizedButton = useCallback(
		(href: string) => (
			<LinkIconButton
				aria-label="Diesen Nutzer einsehen"
				icon={<SettingsIcon />}
				href={href}
			/>
		),
		[],
	);
	const columns = useMemo<Column<TableType>[]>(
		() => [
			{
				accessor: "firstname",
				Cell: ({ value }) => value || memoizedWarningIcon,
				Header: "Vorname",
			},
			{
				accessor: "lastname",
				Cell: ({ value }) => value || memoizedWarningIcon,
				Header: "Nachname",
			},
			{
				accessor: "email",
				Cell: ({ value }) => value || memoizedWarningIcon,
				Header: "E-Mail",
			},
			{
				accessor: "locked",
				Cell: ({ value }) => value && memoizedLockIcon,
				Header: "Gesperrt?",
			},
			{
				accessor: "createdAt",
				Cell: ({ value }) =>
					DateTime.fromJSDate(value)
						.setLocale(locale)
						.toLocaleString(DateTime.DATETIME_SHORT),
				disableGlobalFilter: true,
				Header: "Erstellt am",
			},
			{
				accessor: "updatedAt",
				Cell: ({ value }) =>
					DateTime.fromJSDate(value)
						.setLocale(locale)
						.toLocaleString(DateTime.DATETIME_SHORT),
				disableGlobalFilter: true,
				Header: "Editiert am",
			},
			{
				accessor: "did",
				Cell: ({ value }) => {
					return memoizedButton(`/admin/users/user/${value}`);
				},
				disableGlobalFilter: true,
				hidden: true,
				isNumeric: true,
			},
		],
		[memoizedButton, memoizedLockIcon, memoizedWarningIcon],
	);

	const toast = useToast();

	return (
		<chakra.main w="full">
			<Heading as="h1" size="xl">
				Nutzerverwaltung
			</Heading>
			<Text fontSize="md" mt={2}>
				Nutzer einsehen und bearbeiten
			</Text>
			<Table
				heading="Alle Nutzer:"
				columns={columns}
				data={users}
				trigger={() =>
					toast({
						description: `Um einen neuen Nutzer zu hinterlegen, bitte bei den Admins (Victor) nachfragen!`,
						duration: 3000,
						isClosable: false,
						status: "warning",
						title: "Technisch nicht umsetzbar",
					})
				}
			/>
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

	return <NestedErrorBoundary message={message} name="Nutzerverwaltung" />;
}
