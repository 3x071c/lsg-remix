import type { EditorOptions, JSONContent } from "@tiptap/react";
import type { Params } from "react-router";
import type { ActionFunction, LoaderFunction } from "remix";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { chakra, HStack, Input, Text } from "@chakra-ui/react";
import { Prose } from "@nikolovlazar/chakra-ui-prose";
import { withZod } from "@remix-validated-form/with-zod";
import { generateHTML } from "@tiptap/html";
import { useEditor, EditorContent } from "@tiptap/react";
import { debounce } from "lodash";
import { useState } from "react";
import { ValidatedForm, validationError } from "remix-validated-form";
import superjson from "superjson";
import { PageData } from "~models";
import { authorize } from "~feat/auth";
import { extensions, EditorBar } from "~feat/editor";
import { FormSmartInput, SubmitButton } from "~feat/form";
import { Link } from "~feat/links";
import { prisma } from "~lib/prisma";
import { respond, useActionResponse, useLoaderResponse } from "~lib/response";
import { sanitize } from "~lib/sanitize";

const PageValidatorData = PageData;
const PageValidator = withZod(PageValidatorData);

const getUUID = (params: Params) => {
	const uuid = params["pageUUID"];
	if (!uuid)
		throw new Response("Invalider Seitenaufruf", {
			status: 400,
		});
	return uuid;
};

type LoaderData = {
	categoryUUID: string;
	content: string;
	status: number;
	title: string;
};
const getLoaderData = async (
	request: Request,
	params: Params,
): Promise<LoaderData> => {
	await authorize(request, { cms: true });

	const uuid = getUUID(params);

	const page = await prisma.page.findUnique({
		select: {
			categoryUUID: true,
			content: true,
			title: true,
		},
		where: {
			uuid,
		},
	});
	if (!page)
		throw new Response("Diese Seite existiert nicht", {
			status: 404,
		});

	return {
		categoryUUID: page.categoryUUID,
		content: page.content,
		status: 200,
		title: page.title,
	};
};
export const loader: LoaderFunction = async ({ request, params }) =>
	respond<LoaderData>(await getLoaderData(request, params));

type ActionData = {
	status: number;
	formError?: string;
};
const getActionData = async (
	request: Request,
	params: Params,
): Promise<ActionData> => {
	const uuid = getUUID(params);

	const form = await request.formData();
	const { error, data: formData } = await PageValidator.validate(form);
	if (error) throw validationError(error);

	const page = PageData.safeParse({ ...formData });
	if (!page.success) throw new Error("Seite konnte nicht validiert werden");

	await prisma.page.update({
		data: page.data,
		select: { uuid: true },
		where: { uuid },
	});

	return {
		status: 200,
	};
};
export const action: ActionFunction = async ({ request, params }) =>
	respond<ActionData>(await getActionData(request, params));

const Editor = chakra(EditorContent);

export default function Index(): JSX.Element {
	const {
		categoryUUID,
		content: loaderContent,
		title,
	} = useLoaderResponse<LoaderData>();
	const { formError } = useActionResponse<ActionData>();
	const [disabled, setDisabled] = useState(false);

	const [content, setContent] = useState(loaderContent);
	const parsed = superjson.parse<JSONContent>(content);
	const html = sanitize(generateHTML(parsed, extensions));

	const debouncedUpdate = debounce(
		({ editor: _editor }: Parameters<EditorOptions["onUpdate"]>[0]) => {
			setContent(superjson.stringify(_editor.getJSON()));
			setDisabled(false);
		},
		1000,
	);
	const debouncedDisable = debounce(
		() => {
			setDisabled(true);
		},
		1000,
		{ leading: true, trailing: false },
	);

	const editor = useEditor({
		content: html,
		extensions,
		onUpdate: (...args) => {
			debouncedUpdate(...args);
			debouncedDisable();
		},
	});

	return (
		<chakra.main w="full">
			<HStack spacing={2}>
				<Link href="/admin/cms" variant="indicating">
					<ArrowBackIcon mr={2} />
					Zurück zur Übersicht
				</Link>
			</HStack>
			<ValidatedForm validator={PageValidator} method="post">
				<FormSmartInput
					defaultValue={title}
					placeholder="❌ Titel"
					hint="Titel editieren ✍️"
					height={20}
					as="h1"
					p={4}
					pl={0}
					mt={6}
					fontSize={{ base: "4xl", md: "5xl" }}
					fontFamily="heading"
					fontWeight="bold"
					lineHeight={{ base: 1.2, md: 1 }}
					label="Der Seitentitel"
					helper="Wird in der Navigationsleiste und als Überschrift angezeigt"
					name="title"
					clean
				/>
				{editor && (
					<HStack
						w="full"
						mt={2}
						pb={2}
						spacing={4}
						overflowY="auto"
						borderBottomWidth={1}>
						<EditorBar editor={editor} />
					</HStack>
				)}
				<Prose as="section" mt={2}>
					<Editor
						editor={editor}
						sx={{
							">.ProseMirror": {
								borderRadius: "md",
								borderWidth: 2,
								m: 2,
								mt: 4,
								p: 2,
							},
						}}
					/>
				</Prose>
				<Input type="hidden" name="content" value={content} />
				<Input type="hidden" name="categoryUUID" value={categoryUUID} />
				<SubmitButton disabled={disabled}>
					Änderungen übernehmen
				</SubmitButton>
				{formError && (
					<Text mt={2} color="red.400">
						Fehler: {String(formError)}
					</Text>
				)}
			</ValidatedForm>
		</chakra.main>
	);
}
