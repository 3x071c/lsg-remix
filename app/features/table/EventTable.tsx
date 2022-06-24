import type { Column } from "react-table";
import { WarningTwoIcon } from "@chakra-ui/icons";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { Table } from "~feat/table";
import { locale } from "~lib/globals";

type TableType = {
	startsAt: Date;
	endsAt: Date;
	title: string;
};

export function EventTable({
	events,
	trigger,
}: {
	events: TableType[];
	trigger?: () => void;
}) {
	const memoizedWarningIcon = useMemo(() => <WarningTwoIcon />, []);
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
					DateTime.fromJSDate(value)
						.setLocale(locale)
						.toLocaleString(DateTime.DATETIME_SHORT),
				disableGlobalFilter: true,
				Header: "Von",
			},
			{
				accessor: "endsAt",
				Cell: ({ value }) =>
					DateTime.fromJSDate(value)
						.setLocale(locale)
						.toLocaleString(DateTime.DATETIME_SHORT),
				disableGlobalFilter: true,
				Header: "Bis",
			},
		],
		[memoizedWarningIcon],
	);

	return (
		<Table
			heading="Alle Termine:"
			columns={columns}
			data={events}
			trigger={trigger}
		/>
	);
}
