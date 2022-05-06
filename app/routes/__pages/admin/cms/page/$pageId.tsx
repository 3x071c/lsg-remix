import type { JSONContent } from "@tiptap/react";
import type { Params } from "react-router";
import type { ActionFunction, LoaderFunction } from "remix";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
	Heading,
	Text,
	chakra,
	EditablePreview,
	useColorModeValue,
	IconButton,
	Input,
	useEditableControls,
	ButtonGroup,
	Editable,
	Tooltip,
	EditableInput,
} from "@chakra-ui/react";
import { withZod } from "@remix-validated-form/with-zod";
import { generateHTML } from "@tiptap/html";
import { validationError } from "remix-validated-form";
import superjson from "superjson";
import { Page } from "~models";
import { Editor, extensions } from "~feat/editor";
import { Link } from "~feat/links";
import { prisma } from "~lib/prisma";
import { respond, useActionResponse, useLoaderResponse } from "~lib/response";
import { sanitize } from "~lib/sanitize";

const pageValidatorData = Page.pick({
	content: true,
	title: true,
});
const pageValidator = withZod(pageValidatorData);

type LoaderData = {
	json: JSONContent;
	title: string;
	status: number;
};
const getLoaderData = async (params: Params): Promise<LoaderData> => {
	const id = Number(params["pageId"]);
	if (!id)
		throw new Response("Invalider Seitenaufruf", {
			status: 400,
		});

	const page = await prisma.page.findUnique({
		select: {
			content: true,
			title: true,
		},
		where: {
			id,
		},
	});
	if (!page)
		throw new Response("Diese Seite existiert nicht", {
			status: 404,
		});

	const json = superjson.parse<JSONContent>(page.content);

	return { json, status: 200, title: page.title };
};
export const loader: LoaderFunction = async ({ params }) =>
	respond<LoaderData>(await getLoaderData(params));

type ActionData = {
	status: number;
	formError?: string;
};
const getActionData = async (
	request: Request,
	params: Params,
): Promise<ActionData> => {
	const id = Number(params["pageId"]);
	if (!id)
		throw new Response("Invalider Seitenaufruf", {
			status: 400,
		});
	const form = await request.formData();
	const { error, data } = await pageValidator.validate(form);
	if (error) throw validationError(error);
	if (!data)
		return {
			formError: "Es sind unzureichende Daten angekommen",
			status: 400,
		};
	const { content, title } = data;

	await prisma.page.update({
		data: { content, title },
		select: {},
		where: { id },
	});

	return {
		status: 200,
	};
};
export const action: ActionFunction = async ({ request, params }) =>
	respond<ActionData>(await getActionData(request, params));

function EditableControls(): JSX.Element | null {
	const { isEditing, getSubmitButtonProps, getCancelButtonProps } =
		useEditableControls();

	return isEditing ? (
		<ButtonGroup justifyContent="end" size="sm" w="full" spacing={2} mt={2}>
			<IconButton
				aria-label="Submit"
				icon={<CheckIcon />}
				{...getSubmitButtonProps()}
			/>
			<IconButton
				aria-label="Cancel"
				icon={<CloseIcon boxSize={3} />}
				{...getCancelButtonProps()}
			/>
		</ButtonGroup>
	) : null;
}

export default function Index(): JSX.Element {
	const { json, title } = useLoaderResponse<LoaderData>();
	const actionData = useActionResponse<ActionData>();
	const html = sanitize(generateHTML(json, extensions));

	return (
		<chakra.main w="full" overflow="hidden">
			<Link href="/admin/cms" variant="normal">
				Zurück zur Übersicht
			</Link>
			<Heading as="h1" size="xl">
				Seitendetails
			</Heading>
			<Text fontSize="md" mt={2}>
				Einsehen und Bearbeiten
			</Text>
			<Editable
				defaultValue={title}
				isPreviewFocusable
				selectAllOnFocus={false}>
				<Tooltip label="Click to edit">
					<EditablePreview
						py={2}
						px={4}
						_hover={{
							background: useColorModeValue(
								"gray.100",
								"gray.700",
							),
						}}
					/>
				</Tooltip>
				<Input py={2} px={4} as={EditableInput} />
				<EditableControls />
			</Editable>
			<Editor html={html} />
			<Text>{JSON.stringify(actionData || "{}")}</Text>
		</chakra.main>
	);
}
