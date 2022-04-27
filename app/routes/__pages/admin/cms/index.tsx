import type { Column } from "react-table";
import type { ActionFunction, LoaderFunction } from "remix";
import type { PageTableType } from "~feat/admin/pagetable";
import { AddIcon, WarningTwoIcon } from "@chakra-ui/icons";
import {
	Heading,
	Text,
	chakra,
	Wrap,
	WrapItem,
	Button,
	useDisclosure,
} from "@chakra-ui/react";
import { withZod } from "@remix-validated-form/with-zod";
import { useMemo } from "react";
import { validationError } from "remix-validated-form";
import { z } from "zod";
import { Page, PageCategory } from "~models";
import { PageModal } from "~feat/admin/pagemodal";
import { PageTable, FilterInput } from "~feat/admin/pagetable";
import { Statistics } from "~feat/admin/statistics";
import { prisma, toIndexedObject } from "~feat/prisma";
import { respond, useActionResponse, useLoaderResponse } from "~lib/response";

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

export default function Index(): JSX.Element {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { categoryData, pageData } = useLoaderResponse<LoaderData>();
	const actionData = useActionResponse<ActionData>();

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
	const columns = useMemo<Column<PageTableType>[]>(
		() => [
			{
				accessor: "title",
				Header: "Titel",
			},
			{
				accessor: "categoryId",
				Cell: ({ value }) =>
					indexedCategoryData[value]?.name ?? memoizedWarningTwoIcon,
				disableGlobalFilter: true,
				Header: "Kategorie",
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
		],
		[memoizedWarningTwoIcon, dateOpts, indexedCategoryData],
	);

	return (
		<chakra.main w="full" overflow="hidden">
			<Heading as="h1" size="xl">
				Content Management
			</Heading>
			<Text fontSize="md" mt={2}>
				Seiten einsehen und bearbeiten
			</Text>
			<Statistics data={pageData} />
			<Wrap spacing={2} align="center" justify="space-between">
				<WrapItem>
					<Heading as="h2" size="lg" my={4}>
						Alle Seiten:
					</Heading>
				</WrapItem>
				<WrapItem>
					<FilterInput />
					<Button ml={2} leftIcon={<AddIcon />} onClick={onOpen}>
						Neu
					</Button>
				</WrapItem>
			</Wrap>
			<PageTable columns={columns} data={pageData} />
			<PageModal
				categoryValidator={pageCategoryValidator}
				pageValidator={pageValidator}
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
