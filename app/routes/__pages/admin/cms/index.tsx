import type { HeaderGroup, ColumnInstance } from "react-table";
import type { LoaderFunction } from "remix";
import { TriangleDownIcon, TriangleUpIcon, UpDownIcon } from "@chakra-ui/icons";
import {
	Heading,
	Text,
	chakra,
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	StatGroup,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useTable, useSortBy } from "react-table";
import { json, useLoaderData } from "remix";
import { pages } from "~app/models";

const getLoaderData = async () => {
	const { data: pageData } = await pages().listValues("title");

	return {
		pageData,
	};
};
type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;
export const loader: LoaderFunction = async () =>
	json<LoaderData>(await getLoaderData());

export default function Index(): JSX.Element {
	const { pageData } = useLoaderData<LoaderData>();
	const data = useMemo(
		() => [
			{
				factor: 25.4,
				fromUnit: "inches",
				toUnit: "millimetres (mm)",
			},
			{
				factor: 30.48,
				fromUnit: "feet",
				toUnit: "centimetres (cm)",
			},
			{
				factor: 0.91444,
				fromUnit: "yards",
				toUnit: "metres (m)",
			},
		],
		[],
	);

	const columns = useMemo(
		() =>
			[
				{
					accessor: "fromUnit",
					Header: "To convert",
					isNumeric: false,
				},
				{
					accessor: "toUnit",
					Header: "Into",
					isNumeric: false,
				},
				{
					accessor: "factor",
					Header: "Multiply by",
					isNumeric: true,
				},
			] as const,
		[],
	);

	type TableType = {
		factor: number;
		fromUnit: string;
		toUnit: string;
	};
	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
		useTable<TableType>({ columns, data }, useSortBy);

	return (
		<chakra.main w="full">
			<Heading as="h1" size="xl">
				Content Management
			</Heading>
			<Text fontSize="md" mt={2}>
				Seiten einsehen und bearbeiten
			</Text>
			<StatGroup
				mt={8}
				borderWidth="1px"
				borderRadius="2xl"
				textAlign="center">
				<Stat borderRightWidth="1px">
					<StatLabel>Seiten</StatLabel>
					<StatNumber>{pageData.length}</StatNumber>
					<StatHelpText>Anzahl</StatHelpText>
				</Stat>

				<Stat>
					<StatLabel>Status</StatLabel>
					<StatNumber>OK</StatNumber>
					<StatHelpText>Operational</StatHelpText>
				</Stat>
			</StatGroup>
			<Heading as="h2" size="lg" my={4}>
				Alle Seiten:
			</Heading>
			<Table {...getTableProps()} variant="striped" colorScheme="gray">
				<Thead>
					{headerGroups.map((headerGroup) => (
						<Tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column) => (
								<Th
									{...column.getHeaderProps(
										column.getSortByToggleProps(),
									)}
									isNumeric={
										(
											column as HeaderGroup<TableType> &
												Omit<
													typeof columns[number],
													"accessor" | "Header"
												>
										).isNumeric
									}>
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
									<Td
										{...cell.getCellProps()}
										isNumeric={
											(
												cell.column as ColumnInstance<TableType> &
													Omit<
														typeof columns[number],
														"accessor" | "Header"
													>
											).isNumeric
										}>
										{cell.render("Cell")}
									</Td>
								))}
							</Tr>
						);
					})}
				</Tbody>
			</Table>
		</chakra.main>
	);
}

export const url = "/admin/cms";
