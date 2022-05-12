import type { Column } from "react-table";
import type { ActionFunction, LoaderFunction } from "remix";
import { EditIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { Heading, Text, chakra, useDisclosure } from "@chakra-ui/react";
import { useCallback, useMemo } from "react";
import { validationError } from "remix-validated-form";
import { PageData, PageCategoryData } from "~models";
import {
	PageModal,
	PageValidator,
	PageCategoryValidator,
} from "~feat/admin/pagemodal";
import { Statistics } from "~feat/admin/statistics";
import { authorize } from "~feat/auth";
import { LinkIconButton } from "~feat/links";
import { Table } from "~feat/table";
import { prisma, toIndexedObject } from "~lib/prisma";
import { respond, useActionResponse, useLoaderResponse } from "~lib/response";

type LoaderData = {
	categoryData: {
		uuid: string;
		name: string;
	}[];
	headers: HeadersInit;
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
	const [, headers] = await authorize(request, { cms: true });

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
		headers,
		pageData,
		status: 200,
	};
};
export const loader: LoaderFunction = async ({ request }) =>
	respond<LoaderData>(await getLoaderData(request));

type ActionData = {
	formError?: string;
	headers: HeadersInit;
	status: number;
};
const getActionData = async (request: Request): Promise<ActionData> => {
	const [, headers] = await authorize(request, { cms: true });

	const form = await request.formData();
	const subject = form.get("_subject");

	if (subject === "page") {
		const { error, data: formData } = await PageValidator.validate(form);
		if (error) throw validationError(error);

		const page = PageData.safeParse({ ...formData });
		if (!page.success)
			throw new Error("Seite konnte nicht validiert werden");

		await prisma.page.create({
			data: page.data,
		});

		return {
			headers,
			status: 200,
		};
	}
	if (subject === "pageCategory") {
		const { error, data: formData } = await PageCategoryValidator.validate(
			form,
		);
		if (error) throw validationError(error);

		const pageCategory = PageCategoryData.safeParse({ ...formData });
		if (!pageCategory.success)
			throw new Error("Kategorie konnte nicht validiert werden");

		await prisma.pageCategory.create({ data: pageCategory.data });

		return { headers, status: 200 };
	}

	return {
		formError: "Es fehlen interne Daten der Anfrage",
		headers,
		status: 400,
	};
};
export const action: ActionFunction = async ({ request }) =>
	respond<ActionData>(await getActionData(request));

export default function CMS(): JSX.Element {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { categoryData, pageData } = useLoaderResponse<LoaderData>();
	const { formError } = useActionResponse<ActionData>();

	const indexedCategoryData = useMemo(
		() => toIndexedObject(categoryData),
		[categoryData],
	);
	const memoizedWarningIcon = useMemo(() => <WarningTwoIcon />, []);
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
	const columns = useMemo<
		Column<{
			updatedAt: Date;
			createdAt: Date;
			categoryUUID: string;
			title: string;
			uuid: string;
		}>[]
	>(
		() => [
			{
				accessor: "title",
				Cell: ({ value }) => value || memoizedWarningIcon,
				Header: "Titel",
			},
			{
				accessor: "categoryUUID",
				Cell: ({ value }) =>
					indexedCategoryData[value]?.name ?? memoizedWarningIcon,
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
		[memoizedWarningIcon, dateOpts, indexedCategoryData, memoizedButton],
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
			<Table
				heading="Alle Seiten:"
				columns={columns}
				data={pageData}
				trigger={onOpen}
			/>
			<PageModal
				categoryData={categoryData}
				isOpen={isOpen}
				onClose={onClose}
				errorMessage={formError}
			/>
		</chakra.main>
	);
}
