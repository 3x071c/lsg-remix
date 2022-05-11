import type { JSONContent } from "@tiptap/react";
import type { Column } from "react-table";
import type { ActionFunction, LoaderFunction } from "remix";
import type { PageTableType } from "~feat/admin/pagetable";
import { EditIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { Heading, Text, chakra, useDisclosure } from "@chakra-ui/react";
import { withZod } from "@remix-validated-form/with-zod";
import { useCallback, useMemo } from "react";
import { validationError } from "remix-validated-form";
import superjson from "superjson";
import { z } from "zod";
import { Page, PageCategory } from "~models";
import { PageModal } from "~feat/admin/pagemodal";
import { PageTable } from "~feat/admin/pagetable";
import { Statistics } from "~feat/admin/statistics";
import { authorize } from "~feat/auth";
import { LinkIconButton } from "~feat/links";
import { prisma, toIndexedObject } from "~lib/prisma";
import { respond, useActionResponse, useLoaderResponse } from "~lib/response";

const pageValidatorData = Page.pick({
	title: true,
}).extend({
	categoryUUID: z.string({
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
		uuid: string;
		name: string;
	}[];
	pageData: {
		uuid: string;
		updatedAt: Date;
		createdAt: Date;
		categoryUUID: string;
		title: string;
	}[];
	status: number;
};
const getLoaderData = async (request: Request): Promise<LoaderData> => {
	await authorize(request);

	const categoryData = await prisma.pageCategory.findMany({
		select: {
			name: true,
			uuid: true,
		},
	});

	const pageData = await prisma.page.findMany({
		select: {
			categoryUUID: true,
			createdAt: true,
			title: true,
			updatedAt: true,
			uuid: true,
		},
	});

	return {
		categoryData,
		pageData,
		status: 200,
	};
};
export const loader: LoaderFunction = async ({ request }) =>
	respond<LoaderData>(await getLoaderData(request));

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
		const { title, categoryUUID } = data;
		if (!categoryUUID)
			return {
				formError:
					"Die angegebene Kategorie konnte nicht ermittelt werden",
				status: 400,
			};

		const emptyDocument: JSONContent = { content: [], type: "doc" };
		const emptyDocumentString = superjson.stringify(emptyDocument);

		return {
			...(await prisma.page.create({
				data: { categoryUUID, content: emptyDocumentString, title },
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
	const memoizedButton = useCallback(
		(href: string) => (
			<LinkIconButton
				aria-label="Diese Seite editieren"
				icon={<EditIcon />}
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
	const columns = useMemo<Column<PageTableType>[]>(
		() => [
			{
				accessor: "title",
				Header: "Titel",
			},
			{
				accessor: "categoryUUID",
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
			{
				accessor: "uuid",
				Cell: ({ value }) => {
					return memoizedButton(`/admin/cms/page/${value}`);
				},
				disableGlobalFilter: true,
				hidden: true,
				isNumeric: true,
			},
		],
		[memoizedWarningTwoIcon, dateOpts, indexedCategoryData, memoizedButton],
	);

	return (
		<chakra.main w="full">
			<Heading as="h1" size="xl">
				Content Management
			</Heading>
			<Text fontSize="md" mt={2}>
				Seiten einsehen und bearbeiten
			</Text>
			<Statistics data={pageData} />
			<PageTable columns={columns} data={pageData} newPage={onOpen} />
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
