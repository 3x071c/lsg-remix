import type { JSONContent } from "@tiptap/react";
import type { Params } from "react-router";
import type { ActionFunction, LoaderFunction } from "remix";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Text, chakra, HStack } from "@chakra-ui/react";
import { Prose } from "@nikolovlazar/chakra-ui-prose";
import { withZod } from "@remix-validated-form/with-zod";
import { generateHTML } from "@tiptap/html";
import { useEditor, EditorContent } from "@tiptap/react";
import { validationError } from "remix-validated-form";
import superjson from "superjson";
import { Page } from "~models";
import { extensions, EditorBar } from "~feat/editor";
import { Link } from "~feat/links";
import { SmartInput } from "~feat/smartinput";
import { prisma } from "~lib/prisma";
import { respond, useActionResponse, useLoaderResponse } from "~lib/response";
import { sanitize } from "~lib/sanitize";

const pageValidatorData = Page.pick({
	content: true,
	title: true,
});
const pageValidator = withZod(pageValidatorData);

const getUUID = (params: Params) => {
	const uuid = params["pageUUID"];
	if (!uuid)
		throw new Response("Invalider Seitenaufruf", {
			status: 400,
		});
	return uuid;
};

type LoaderData = {
	json: JSONContent;
	title: string;
	status: number;
};
const getLoaderData = async (params: Params): Promise<LoaderData> => {
	const uuid = getUUID(params);

	const page = await prisma.page.findUnique({
		select: {
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
	const uuid = getUUID(params);

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
	const { json, title } = useLoaderResponse<LoaderData>();
	const actionData = useActionResponse<ActionData>();
	const html = sanitize(generateHTML(json, extensions));
	const editor = useEditor({
		content: html,
		extensions,
	});

	return (
		<chakra.main w="full" overflow="hidden">
			<HStack spacing={2}>
				<Link href="/admin/cms" variant="indicating">
					<ArrowBackIcon mr={2} />
					Zurück zur Übersicht
				</Link>
			</HStack>
			<SmartInput
				as="h1"
				defaultValue={title}
				hint="Titel editieren ✍️"
				height={20}
				p={4}
				pl={0}
				fontSize={{ base: "4xl", md: "5xl" }}
				fontFamily="heading"
				fontWeight="bold"
				lineHeight={{ base: 1.2, md: 1 }}
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
			<Text>
				{Object.keys(actionData).length > 0
					? JSON.stringify(actionData)
					: "Eventuelle Änderungen wurden nicht gesichert!"}
			</Text>
		</chakra.main>
	);
}
