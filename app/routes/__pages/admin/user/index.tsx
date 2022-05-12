import type { ActionFunction, LoaderFunction } from "remix";
import { Heading, chakra, Text, VStack, Box } from "@chakra-ui/react";
import { withZod } from "@remix-validated-form/with-zod";
import { redirect } from "remix";
import { ValidatedForm, validationError } from "remix-validated-form";
import { User, UserData } from "~models";
import { revalidate, commitSession, authorize } from "~feat/auth";
import { FormSmartInput, SubmitButton } from "~feat/form";
import { prisma } from "~lib/prisma";
import { respond, useActionResponse, useLoaderResponse } from "~lib/response";

const UserValidatorData = UserData.pick({
	firstname: true,
	lastname: true,
});
const UserValidator = withZod(UserValidatorData);

type LoaderData = {
	firstname?: string;
	lastname?: string;
	message: string;
	status: number;
};
const getLoaderData = async (request: Request): Promise<LoaderData> => {
	const sessionData = await authorize(request, { ignore: true });
	const { did } = sessionData;

	const user = await prisma.user.findUnique({
		where: { did },
	});
	if (!user)
		return {
			message:
				"Willkommen! 👋 Um die Registration abzuschließen, müssen folgende Daten hinterlegt werden:",
			status: 200,
		};

	const parsedUser = User.safeParse(user);
	if (!parsedUser.success)
		return {
			firstname: user.firstname,
			lastname: user.lastname,
			message:
				"Willkommen zurück! 🍻 Bitte überprüfen und ergänzen Sie ihre inzwischen unvollständigen Nutzerdaten.",
			status: 200,
		};
	const { firstname, lastname } = parsedUser.data;

	const parsedSession = User.safeParse(sessionData);
	if (!parsedSession.success) {
		const session = await revalidate(request, did);
		throw redirect("/admin", {
			headers: {
				"Set-Cookie": await commitSession(session),
			},
		});
	}

	return {
		firstname,
		lastname,
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
	const { did, email } = await authorize(request, { ignore: true });

	const form = await request.formData();
	const { error, data } = await UserValidator.validate(form);
	if (error) throw validationError(error);

	await prisma.user.upsert({
		create: { ...data, did, email },
		select: { uuid: true },
		update: data,
		where: { did },
	});

	const session = await revalidate(request, did);

	throw redirect("/admin", {
		headers: {
			"Set-Cookie": await commitSession(session),
		},
	});
};
export const action: ActionFunction = async ({ request }) =>
	respond<ActionData>(await getActionData(request));

export default function Settings() {
	const { message, firstname, lastname } = useLoaderResponse<LoaderData>();
	const { formError } = useActionResponse<ActionData>();

	return (
		<chakra.main w="full">
			<Heading as="h1" size="2xl">
				Profil
			</Heading>
			<Text fontSize="lg" mt={2} mb={4}>
				{message}
			</Text>
			<ValidatedForm validator={UserValidator} method="post">
				<VStack spacing={4}>
					<Box w="full">
						<FormSmartInput
							defaultValue={firstname}
							placeholder="❌ Vorname"
							hint="Editieren ✍️"
							height={12}
							maxW={500}
							p={2}
							pl={0}
							label="Ihr Vorname"
							helper={`${
								firstname ? "" : "Wurde noch nicht hinterlegt! "
							}Ihr Vorname dient der Identitätserfassung und einer persönlicheren Nutzererfahrung.`}
							name="firstname"
						/>
					</Box>
					<Box w="full">
						<FormSmartInput
							defaultValue={lastname}
							placeholder="❌ Nachname"
							hint="Editieren ✍️"
							height={12}
							maxW={500}
							p={2}
							pl={0}
							label="Ihr Nachname"
							helper={`${
								lastname ? "" : "Wurde noch nicht hinterlegt! "
							}Ihr Nachname dient der Identitätserfassung und einer persönlicheren Nutzererfahrung.`}
							name="lastname"
						/>
					</Box>
					<Box w="full">
						<SubmitButton>Speichern</SubmitButton>
					</Box>
					{formError && (
						<Text maxW="sm" mt={2} color="red.400">
							Fehler: {String(formError)}
						</Text>
					)}
				</VStack>
			</ValidatedForm>
		</chakra.main>
	);
}
