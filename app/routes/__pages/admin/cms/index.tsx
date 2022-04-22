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
import { useEffect, useMemo, useRef, useState } from "react";
import FocusLock from "react-focus-lock";
import { useTable, useSortBy } from "react-table";
import { useTransition } from "remix";
import { ValidatedForm, validationError } from "remix-validated-form";
import { z } from "zod";
import { Page, PageCategory } from "~models";
import { FormInput, FormSelect, SubmitButton } from "~feat/form";
import { PrismaClient as prisma, toIndexedObject } from "~feat/prisma";
import { respond, useActionResponse, useLoaderResponse } from "~lib/response";
import { keys } from "~lib/util";

const pageValidatorData = Page.pick({
	title: true,
}).extend({
	categoryId: z.string({
		description: "Die Kategorie",
		invalid_type_error: "Kategorie konnte nicht korrekt übermittelt werden",
		required_error: "Kategorie muss angegeben werden",
	}),
});
const pageValidator = withZod(pageValidatorData);
const pageCategoryValidatorData = PageCategory.pick({
	name: true,
});
const pageCategoryValidator = withZod(pageCategoryValidatorData);

type LoaderData = {
	categoryData: {
		id: number;
		name: string;
	}[];
	pageData: {
		id: number;
		updatedAt: Date;
		createdAt: Date;
		categoryId: number;
		title: string;
	}[];
	status: number;
};
const getLoaderData = async (): Promise<LoaderData> => {
	const categoryData = await prisma.pageCategory.findMany({
		select: {
			id: true,
			name: true,
		},
	});

	const pageData = await prisma.page.findMany({
		select: {
			categoryId: true,
			createdAt: true,
			id: true,
			title: true,
			updatedAt: true,
		},
	});

	return {
		categoryData,
		pageData,
		status: 200,
	};
};
export const loader: LoaderFunction = async () =>
	respond<LoaderData>(await getLoaderData());

type ActionData = (
	| Page
	| PageCategory
	| {
			formError: string;
	  }
) & {
	status: number;
};

const getActionData = async (request: Request): Promise<ActionData> => {
	const form = await request.formData();
	const subject = form.get("_subject");

	if (subject === "page") {
		const { error, data } = await pageValidator.validate(form);
		if (error) throw validationError(error);
		if (!data)
			return {
				formError: "Es sind unzureichende Daten angekommen",
				status: 400,
			};
		const { title, categoryId: categoryIdRaw } = data;
		const categoryId = Number(categoryIdRaw);
		if (!categoryId)
			return {
				formError:
					"Die angegebene Kategorie konnte nicht ermittelt werden",
				status: 400,
			};
		return {
			...(await prisma.page.create({
				data: { categoryId, content: `Inhalt für ${title}`, title },
			})),
			status: 200,
		};
	}
	if (subject === "pageCategory") {
		const { error, data } = await pageCategoryValidator.validate(form);
		if (error) throw validationError(error);
		if (!data)
			return {
				formError: "Es sind unzureichende Daten angekommen",
				status: 400,
			};
		return { ...(await prisma.pageCategory.create({ data })), status: 200 };
	}
	return { formError: "Es fehlen interne Daten der Anfrage", status: 400 };
};
export const action: ActionFunction = async ({ request }) =>
	respond<ActionData>(await getActionData(request));

function CategoryPopover({
	setCloseable,
}: {
	setCloseable: (arg: boolean) => void;
}): JSX.Element {
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

	useEffect(() => {
		setCloseable(!isOpen);
	}, [isOpen, setCloseable]);

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
					<ValidatedForm
						validator={pageCategoryValidator}
						method="post">
						<input
							type="hidden"
							name="_subject"
							value="pageCategory"
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
	categoryData,
	errorMessage,
}: {
	isOpen: boolean;
	onClose: () => void;
	categoryData: LoaderData["categoryData"];
	errorMessage?: string;
}): JSX.Element {
	const transition = useTransition();
	const [submitted, setSubmitted] = useState(false);
	const [closeable, setCloseable] = useState(true);

	useEffect(() => {
		if (transition.state === "loading" && submitted) {
			setSubmitted(false);
			onClose();
		}
	}, [transition.state, onClose, submitted]);

	return (
		<Modal
			isOpen={!closeable || isOpen}
			onClose={closeable ? onClose : () => {}}
			closeOnEsc={closeable}
			closeOnOverlayClick={closeable}>
			<ModalOverlay backdropFilter="auto" backdropBlur="10px" />
			<ModalContent>
				<ModalHeader>Neue Seite</ModalHeader>
				{closeable && <ModalCloseButton />}
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
						name="categoryId"
						placeholder="✍️ Kategorie auswählen"
						helper="Die Kategorie der Seite, welche zur Eingliederung u.a. in der Navigationsleiste verwendet wird"
						label="Die Kategorie"
						form="pageForm"
						formId="pageForm"
						rightChild={
							<CategoryPopover setCloseable={setCloseable} />
						}>
						{categoryData.map(({ id, name }) => (
							<option value={id} key={id}>
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
	const { categoryData, pageData } = useLoaderResponse<LoaderData>();
	const actionData = useActionResponse<ActionData>();

	type TableType = typeof pageData[number];
	const indexedCategoryData = useMemo(
		() => toIndexedObject(categoryData),
		[categoryData],
	);
	const memoizedWarningTwoIcon = useMemo(() => <WarningTwoIcon />, []);
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
				accessor: "categoryId",
				Cell: ({ value }) =>
					indexedCategoryData[value]?.name ?? memoizedWarningTwoIcon,
				Header: "Kategorie",
			},
			{
				accessor: "createdAt",
				Cell: ({ value }) =>
					new Date(value).toLocaleString("de", dateOpts),
				Header: "Erstellt am",
			},
			{
				accessor: "updatedAt",
				Cell: ({ value }) =>
					new Date(value).toLocaleString("de", dateOpts),
				Header: "Editiert am",
			},
		],
		[memoizedWarningTwoIcon, dateOpts, indexedCategoryData],
	);

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
		useTable<TableType>({ columns, data: pageData }, useSortBy);

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
					<StatNumber>{keys(pageData).length}</StatNumber>
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
				categoryData={categoryData}
				isOpen={isOpen}
				onClose={onClose}
				errorMessage={
					(actionData as { formError?: string } | null)?.formError
				}
			/>
		</chakra.main>
	);
}
