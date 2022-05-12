import type { Column } from "react-table";
import type { LoaderFunction } from "remix";
import { LockIcon, SettingsIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { Heading, chakra, Text, useToast } from "@chakra-ui/react";
import { useCallback, useMemo } from "react";
import { authorize } from "~feat/auth";
import { LinkIconButton } from "~feat/links";
import { Table } from "~feat/table";
import { prisma } from "~lib/prisma";
import { respond, useLoaderResponse } from "~lib/response";

type TableType = {
	did: string;
	email: string;
	firstname: string;
	lastname: string;
	locked: boolean;
	updatedAt: Date;
	createdAt: Date;
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
					new Date(value).toLocaleString("de", dateOpts),
				disableGlobalFilter: true,
				Header: "Erstellt am",
			},
			{
				accessor: "updatedAt",
				Cell: ({ value }) =>
					new Date(value).toLocaleString("de", dateOpts),
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
		[dateOpts, memoizedButton, memoizedLockIcon, memoizedWarningIcon],
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
						description: `Noch nicht implementiert`,
						duration: 3000,
						isClosable: false,
						status: "info",
						title: "Aktuell nicht möglich",
					})
				}
			/>
		</chakra.main>
	);
}
