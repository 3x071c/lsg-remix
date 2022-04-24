import type { Column, Row } from "react-table";
import { TriangleDownIcon, TriangleUpIcon, UpDownIcon } from "@chakra-ui/icons";
import {
	chakra,
	Table,
	TableContainer,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
} from "@chakra-ui/react";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table";

export const preGlobalFilteredRowsAtom = atom<Row<PageTableType>[]>([]);
export const rawGlobalFilterAtom = atom<unknown>(null);
export const rawSetGlobalFilterAtom = atom<{
	fn: (filterValue: unknown) => void;
}>({ fn: () => {} });
export const globalFilterAtom = atom(
	(get) => get(rawGlobalFilterAtom),
	(get, _set, filterValue) => get(rawSetGlobalFilterAtom).fn(filterValue),
);

export type PageTableType = {
	updatedAt: Date;
	createdAt: Date;
	categoryId: number;
	title: string;
};
export type PageTableProps = {
	columns: Column<PageTableType>[];
	data: PageTableType[];
};
export function PageTable({ columns, data }: PageTableProps): JSX.Element {
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		state,
		preGlobalFilteredRows: preGlobalFilteredRowsRaw,
		setGlobalFilter: setGlobalFilterRaw,
	} = useTable<PageTableType>({ columns, data }, useGlobalFilter, useSortBy);
	const [, setPreGlobalFilteredRows] = useAtom(preGlobalFilteredRowsAtom);
	const [, setRawGlobalFilter] = useAtom(rawGlobalFilterAtom);
	const [, setRawSetGlobalFilter] = useAtom(rawSetGlobalFilterAtom);

	useEffect(() => {
		setPreGlobalFilteredRows(preGlobalFilteredRowsRaw);
	}, [preGlobalFilteredRowsRaw, setPreGlobalFilteredRows]);

	useEffect(() => {
		setRawGlobalFilter(state.globalFilter);
	}, [setRawGlobalFilter, state.globalFilter]);

	useEffect(() => {
		setRawSetGlobalFilter({ fn: setGlobalFilterRaw });
	}, [setGlobalFilterRaw, setRawSetGlobalFilter]);

	return (
		<TableContainer>
			<Table {...getTableProps()} variant="striped" colorScheme="gray">
				<Thead>
					{headerGroups.map((headerGroup) => (
						<Tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column) => (
								<Th
									{...column.getHeaderProps(
										column.getSortByToggleProps(),
									)}>
									{column.render("Header")}
									<chakra.span pl="4">
										{(() => {
											if (column.isSorted) {
												if (column.isSortedDesc)
													return (
														<TriangleDownIcon aria-label="sorted descending" />
													);
												return (
													<TriangleUpIcon aria-label="sorted ascending" />
												);
											}
											return (
												<UpDownIcon aria-label="Click to sort" />
											);
										})()}
									</chakra.span>
								</Th>
							))}
						</Tr>
					))}
				</Thead>
				<Tbody {...getTableBodyProps()}>
					{rows.map((row) => {
						prepareRow(row);
						return (
							<Tr {...row.getRowProps()}>
								{row.cells.map((cell) => (
									<Td {...cell.getCellProps()}>
										{cell.render("Cell")}
									</Td>
								))}
							</Tr>
						);
					})}
				</Tbody>
			</Table>
		</TableContainer>
	);
}
