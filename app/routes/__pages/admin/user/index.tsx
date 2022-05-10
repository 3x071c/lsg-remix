import type { ActionFunction, LoaderFunction } from "remix";
import { Heading, chakra, Text } from "@chakra-ui/react";
import { withZod } from "@remix-validated-form/with-zod";
import { redirect } from "remix";
import { ValidatedForm, validationError } from "remix-validated-form";
import { User } from "~models";
import {
	revalidateFromSession,
	revalidateToSession,
	commitSession,
} from "~feat/auth";
import { FormSmartInput, SubmitButton } from "~feat/form";
import { prisma } from "~lib/prisma";
import { respond, useActionResponse, useLoaderResponse } from "~lib/response";

const validatorData = User.omit({
	createdAt: true,
	did: true,
	updatedAt: true,
	uuid: true,
});
const validator = withZod(validatorData);

type LoaderData = Partial<User> & {
	message: string;
	status: number;
};
const getLoaderData = async (request: Request): Promise<LoaderData> => {
	const { did } = await revalidateFromSession(request);
	const user = await prisma.user.findUnique({ where: { did } });

	if (!user)
		return {
			message:
				"Willkommen! 👋 Um die Registration abzuschließen, müssen die folgenden Daten hinterlegt werden:",
			status: 200,
		};

	if (!User.safeParse(user).success)
		return {
			...user,
			message:
				"Willkommen zurück! 🍻 Bitte vervollständigen Sie zuerst die Daten unten, um fortzufahren.",
			status: 200,
		};

	return {
		...user,
		message: "Einstellungen anpassen und Nutzerdaten aktualisieren",
		status: 200,
	};
};
export const loader: LoaderFunction = async ({ request }) =>
	respond<LoaderData>(await getLoaderData(request));

type ActionData = {
	formError?: string;
	status: number;
};
const getActionData = async (request: Request): Promise<ActionData> => {
	const { did, email } = await revalidateFromSession(request);
	const form = await request.formData();
	const { error, data } = await validator.validate(form);
	if (error) throw validationError(error);

	await prisma.user.upsert({
		create: { ...data, did, email },
		select: {},
		update: { ...data, did, email },
		where: { did },
	});

	const session = await revalidateToSession(request, did);

	throw redirect(".", {
		headers: {
			"Set-Cookie": await commitSession(session),
		},
	});
};
export const action: ActionFunction = async ({ request }) =>
	respond<ActionData>(await getActionData(request));

export default function Onboard() {
	const { message, firstname } = useLoaderResponse<LoaderData>();
	const actionData = useActionResponse<ActionData>();

	return (
		<chakra.main w="full" overflow="hidden">
			<Heading as="h1" size="2xl">
				Nutzer
			</Heading>
			<Text fontSize="lg">{message}</Text>
			<ValidatedForm validator={validator} method="post">
				<FormSmartInput
					defaultValue={firstname}
					placeholder="🔤 Vorname"
					hint="Editieren ✍️"
					height={10}
					p={4}
					pl={0}
					label="Ihr Vorname"
					helper="Ihr Vorname wurde noch nicht hinterlegt"
					name="firstname"
				/>
				<SubmitButton w="full">Speichern</SubmitButton>
				{actionData.formError && (
					<Text maxW="sm" mt={2} color="red.400">
						Fehler: {String(actionData?.formError)}
					</Text>
				)}
			</ValidatedForm>
		</chakra.main>
	);
}
