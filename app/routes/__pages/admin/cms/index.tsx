import type { Column } from "react-table";
import type { ActionFunction, LoaderFunction } from "remix";
import {
	AddIcon,
	TriangleDownIcon,
	TriangleUpIcon,
	UpDownIcon,
	WarningTwoIcon,
} from "@chakra-ui/icons";
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
	Wrap,
	WrapItem,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	Input,
	useDisclosure,
	Box,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverArrow,
	PopoverCloseButton,
	ButtonGroup,
	IconButton,
	VStack,
} from "@chakra-ui/react";
import { withZod } from "@remix-validated-form/with-zod";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FocusLock from "react-focus-lock";
import { useTable, useSortBy } from "react-table";
import { json, useLoaderData, useActionData, useTransition } from "remix";
import { ValidatedForm, validationError } from "remix-validated-form";
import { FormInput, FormSelect, SubmitButton } from "~app/form";
import { PageData, PageGroupData, pageGroups, pages } from "~app/models";
import { entries, fromEntries } from "~app/util";

const pageValidatorData = PageData;
const pageValidator = withZod(pageValidatorData);
const pageGroupValidatorData = PageGroupData;
const pageGroupValidator = withZod(pageGroupValidatorData);

const getLoaderData = async () => {
	const opts = { limit: 10 };
	const { data: pagesTitle } = await pages().listValues("title", opts);
	const { data: pageGroupsName } = await pageGroups().listValues("name");

	const groupRefs = fromEntries(
		pageGroupsName.map(({ uuid, value: name }) => [uuid, name] as const),
	);

	const pageData = fromEntries(
		await Promise.all(
			pagesTitle.map(async ({ uuid, value: title }) => {
				const { createdAt, editedAt, groupRef } = await pages().getMany(
					uuid,
					["createdAt", "editedAt", "groupRef"],
				);
				const category = groupRefs[groupRef];

				return [
					uuid,
					{
						category,
						createdAt: createdAt.getTime(),
						editedAt: editedAt.getTime(),
						title,
					},
				] as const;
			}),
		),
	);

	return {
		groupRefs,
		pageData,
	};
};
type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;
export const loader: LoaderFunction = async () =>
	json<LoaderData>(await getLoaderData());

const getActionData = async (request: Request) => {
	const form = await request.formData();
	const subject = form.get("_subject");
	if (!subject)
		return {
			formError: "Es gab ein internes Problem (ERR_SUBJECT_MISSING)",
		};
	if (subject === "page") {
		const { error, data } = await pageValidator.validate(form);
		if (error) throw validationError(error);
		if (!data)
			return { formError: "Bei uns sind keine Daten angekommen >:(" };
		return pages().create(data);
	}
	if (subject === "pageGroup") {
		const { error, data } = await pageGroupValidator.validate(form);
		if (error) throw validationError(error);
		if (!data)
			return { formError: "Bei uns sind keine Daten angekommen >:(" };
		return pageGroups().create(data);
	}
	throw new Error("Es gab ein internes Problem (ERR_SUBJECT_INVALID)");
};
type ActionData = Awaited<ReturnType<typeof getActionData>>;
export const action: ActionFunction = async ({ request }) =>
	json<ActionData>(await getActionData(request));

function CategoryPopover(): JSX.Element {
	const { onOpen, onClose, isOpen } = useDisclosure();
	const transition = useTransition();
	const [submitted, setSubmitted] = useState(false);
	const firstFieldRef = useRef(null);

	useEffect(() => {
		if (transition.state === "loading" && submitted) {
			setSubmitted(false);
			onClose();
		}
	}, [transition.state, onClose, submitted]);

	return (
		<Popover
			isOpen={isOpen}
			initialFocusRef={firstFieldRef}
			onOpen={onOpen}
			onClose={onClose}
			placement="right"
			closeOnBlur={false}
			isLazy>
			<PopoverTrigger>
				<IconButton
					aria-label="Neue Kategorie erstellen"
					icon={<AddIcon />}
				/>
			</PopoverTrigger>
			<PopoverContent p={5}>
				<FocusLock returnFocus persistentFocus={false}>
					<PopoverArrow />
					<PopoverCloseButton />
					<ValidatedForm validator={pageGroupValidator} method="post">
						<input
							type="hidden"
							name="_subject"
							value="pageGroup"
						/>
						<FormInput
							type="text"
							name="name"
							placeholder="🪪 Name"
							helper="Wie soll die neue Kategorie heißen?"
							label="Kategorie"
							ref={firstFieldRef}
						/>
						<ButtonGroup d="flex" justifyContent="flex-end">
							<SubmitButton onClick={() => setSubmitted(true)}>
								Erstellen
							</SubmitButton>
						</ButtonGroup>
					</ValidatedForm>
				</FocusLock>
			</PopoverContent>
		</Popover>
	);
}

function PageModal({
	isOpen,
	onClose,
	groupRefs,
	errorMessage,
}: {
	isOpen: boolean;
	onClose: () => void;
	groupRefs: Record<string, string>;
	errorMessage?: string;
}): JSX.Element {
	const transition = useTransition();
	const [submitted, setSubmitted] = useState(false);

	useEffect(() => {
		if (transition.state === "loading" && submitted) {
			setSubmitted(false);
			onClose();
		}
	}, [transition.state, onClose, submitted]);

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay backdropFilter="auto" backdropBlur="10px" />
			<ModalContent>
				<ModalHeader>Neue Seite</ModalHeader>
				<ModalCloseButton />
				<ValidatedForm
					validator={pageValidator}
					method="post"
					id="pageForm"
				/>
				<input
					type="hidden"
					name="_subject"
					value="page"
					form="pageForm"
				/>
				<ModalBody>
					<FormInput
						type="text"
						name="title"
						placeholder="🔤 Titel"
						helper="Der Name der neuen Seite, welcher u.a. in der Navigationsleiste oben angezeigt wird"
						label="Der Titel"
						form="pageForm"
						formId="pageForm"
					/>
					<FormSelect
						name="groupRef"
						placeholder="✍️ Kategorie auswählen"
						helper="Die Kategorie der Seite, welche zur Eingliederung u.a. in der Navigationsleiste verwendet wird"
						label="Die Kategorie"
						form="pageForm"
						formId="pageForm"
						rightChild={<CategoryPopover />}>
						{entries(groupRefs).map(([uuid, name]) => (
							<option value={uuid} key={uuid}>
								{name}
							</option>
						))}
					</FormSelect>
				</ModalBody>
				<ModalFooter>
					<VStack align="stretch" justify="flex-start" w="full">
						<SubmitButton
							w="full"
							form="pageForm"
							formId="pageForm"
							onClick={() => setSubmitted(true)}>
							Erstellen
						</SubmitButton>
						{errorMessage && (
							<Text maxW="sm" mt={2} color="red.400">
								{String(errorMessage)}
							</Text>
						)}
					</VStack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

export default function Index(): JSX.Element {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { groupRefs, pageData } = useLoaderData<LoaderData>();
	const actionData = useActionData<ActionData>();

	type TableType = typeof pageData[number];
	const data = useMemo(() => entries(pageData).map(([, d]) => d), [pageData]);
	const memoizedWarningTwoIcon = useCallback(() => <WarningTwoIcon />, []);
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
				Header: "Titel",
			},
			{
				accessor: "category",
				Cell: ({ value }) => value ?? memoizedWarningTwoIcon,
				Header: "Kategorie",
			},
			{
				accessor: "createdAt",
				Cell: ({ value }) =>
					new Date(value).toLocaleString(undefined, dateOpts),
				Header: "Erstellt am",
			},
			{
				accessor: "editedAt",
				Cell: ({ value }) =>
					new Date(value).toLocaleString(undefined, dateOpts),
				Header: "Editiert am",
			},
		],
		[memoizedWarningTwoIcon, dateOpts],
	);

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
		useTable<TableType>({ columns, data }, useSortBy);

	return (
		<chakra.main w="full" overflow="hidden">
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
					<StatNumber>{Object.keys(pageData).length}</StatNumber>
					<StatHelpText>Anzahl</StatHelpText>
				</Stat>

				<Stat>
					<StatLabel>Status</StatLabel>
					<StatNumber>OK</StatNumber>
					<StatHelpText>Operational</StatHelpText>
				</Stat>
			</StatGroup>
			<Wrap spacing={2} align="center" justify="space-between">
				<WrapItem>
					<Heading as="h2" size="lg" my={4}>
						Alle Seiten:
					</Heading>
				</WrapItem>
				<WrapItem>
					<Input placeholder="🔍 Filtern" />
					<Button ml={2} leftIcon={<AddIcon />} onClick={onOpen}>
						Neu
					</Button>
				</WrapItem>
			</Wrap>
			<Box w="full" overflowY="scroll">
				<Table
					{...getTableProps()}
					variant="striped"
					colorScheme="gray">
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
			</Box>
			<PageModal
				groupRefs={groupRefs}
				isOpen={isOpen}
				onClose={onClose}
				errorMessage={
					(actionData as { formError?: string } | null)?.formError
				}
			/>
		</chakra.main>
	);
}

export const url = "/admin/cms";
