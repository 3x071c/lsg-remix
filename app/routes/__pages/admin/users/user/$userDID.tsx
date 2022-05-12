import type { Params } from "react-router";
import type { ActionFunction, LoaderFunction } from "remix";
import {
	Heading,
	chakra,
	Text,
	VStack,
	Box,
	SimpleGrid,
} from "@chakra-ui/react";
import { withZod } from "@remix-validated-form/with-zod";
import { redirect } from "remix";
import { ValidatedForm, validationError } from "remix-validated-form";
import { zfd } from "zod-form-data";
import { User, UserData } from "~models";
import { authorize, safeMetadata } from "~feat/auth";
import { FormSmartInput, FormSwitch, SubmitButton } from "~feat/form";
import { prisma } from "~lib/prisma";
import { respond, useActionResponse, useLoaderResponse } from "~lib/response";

const UserValidatorData = UserData.pick({
	firstname: true,
	lastname: true,
}).extend({
	canAccess: zfd.repeatable().optional(),
});
const UserValidator = withZod(UserValidatorData);

const getDID = (params: Params) => {
	const did = params["userDID"];
	if (!did)
		throw new Response("Invalider Seitenaufruf", {
			status: 400,
		});

	return did;
};

type LoaderData = {
	canAccessCMS: boolean;
	canAccessLab: boolean;
	canAccessSchoolib: boolean;
	firstname?: string;
	headers: HeadersInit;
	lastname?: string;
	message: string;
	showAccessCMS: boolean;
	showAccessLab: boolean;
	showAccessSchoolib: boolean;
	status: number;
};
const getLoaderData = async (
	request: Request,
	params: Params,
): Promise<LoaderData> => {
	const did = getDID(params);
	const [user, headers] = await authorize(request, {
		did,
		ignore: true,
		lock: true,
	});
	const {
		canAccessCMS: showAccessCMS,
		canAccessLab: showAccessLab,
		canAccessSchoolib: showAccessSchoolib,
	} = user;

	let target: Partial<User> | null = null;
	if (did === user.did) {
		if (!user.uuid)
			return {
				canAccessCMS: false,
				canAccessLab: false,
				canAccessSchoolib: false,
				headers,
				message:
					"Willkommen! 👋 Um die Registration abzuschließen, müssen folgende Daten hinterlegt werden:",
				showAccessCMS: showAccessCMS ?? false,
				showAccessLab: showAccessLab ?? false,
				showAccessSchoolib: showAccessSchoolib ?? false,
				status: 200,
			};
		target = user;
	} else {
		target = await prisma.user.findUnique({ where: { did } });
	}
	if (!target) throw redirect(`/admin/users/user/${user.did}`, { headers });

	const parsed = User.safeParse(target);
	if (!parsed.success) {
		return {
			canAccessCMS: target.canAccessCMS ?? false,
			canAccessLab: target.canAccessLab ?? false,
			canAccessSchoolib: target.canAccessSchoolib ?? false,
			firstname: target.firstname,
			headers,
			lastname: target.lastname,
			message:
				did === user.did
					? "Willkommen zurück! 🍻 Bitte überprüfen und ergänzen Sie ihre inzwischen unvollständigen Nutzerdaten."
					: "⚠️ Dieser Nutzer ist unvollständig, vor weiterer Aktivität müssen die Daten ergänzt werden",
			showAccessCMS: showAccessCMS ?? false,
			showAccessLab: showAccessLab ?? false,
			showAccessSchoolib: showAccessSchoolib ?? false,
			status: 200,
		};
	}
	const {
		canAccessCMS,
		canAccessLab,
		canAccessSchoolib,
		firstname,
		lastname,
	} = parsed.data;

	return {
		canAccessCMS: canAccessCMS ?? false,
		canAccessLab: canAccessLab ?? false,
		canAccessSchoolib: canAccessSchoolib ?? false,
		firstname,
		headers,
		lastname,
		message: "Einstellungen anpassen und Nutzerdaten aktualisieren",
		showAccessCMS: showAccessCMS ?? false,
		showAccessLab: showAccessLab ?? false,
		showAccessSchoolib: showAccessSchoolib ?? false,
		status: 200,
	};
};
export const loader: LoaderFunction = async ({ request, params }) =>
	respond<LoaderData>(await getLoaderData(request, params));

type ActionData = {
	formError?: string;
	headers: HeadersInit;
	status: number;
};
const getActionData = async (
	request: Request,
	params: Params,
): Promise<ActionData> => {
	const did = getDID(params);
	const [user, headers] = await authorize(request, {
		did,
		ignore: true,
		lock: true,
	});
	const { email } = await safeMetadata(did);
	if (!email)
		return { formError: "This user does not exist", headers, status: 404 };

	const form = await request.formData();
	const { error, data } = await UserValidator.validate(form);
	if (error) throw validationError(error);

	const { firstname, lastname, canAccess } = data;
	const canAccessCMS =
		(canAccess?.includes("cms") && user.canAccessCMS) || false;
	const canAccessLab =
		(canAccess?.includes("lab") && user.canAccessLab) || false;
	const canAccessSchoolib =
		(canAccess?.includes("schoolib") && user.canAccessSchoolib) || false;

	await prisma.user.upsert({
		create: {
			canAccessCMS,
			canAccessLab,
			canAccessSchoolib,
			did,
			email,
			firstname,
			lastname,
		},
		select: { uuid: true },
		update: {
			canAccessCMS,
			canAccessLab,
			canAccessSchoolib,
			firstname,
			lastname,
		},
		where: { did },
	});

	throw redirect("/admin", {
		headers,
	});
};
export const action: ActionFunction = async ({ request, params }) =>
	respond<ActionData>(await getActionData(request, params));

export default function AdminUser() {
	const {
		canAccessCMS,
		canAccessLab,
		canAccessSchoolib,
		showAccessCMS,
		showAccessLab,
		showAccessSchoolib,
		message,
		firstname,
		lastname,
	} = useLoaderResponse<LoaderData>();
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
					<SimpleGrid minChildWidth="300px" w="full">
						{showAccessCMS && (
							<FormSwitch
								label="CMS Zugriff"
								helper="Ob dieser Nutzer auf das Content-Management-System zugreifen darf"
								name="canAccess"
								value="cms"
								defaultChecked={canAccessCMS}
							/>
						)}
						{showAccessLab && (
							<FormSwitch
								label="LAB Zugriff"
								helper="Ob dieser Nutzer auf das Admin Lab zugreifen darf"
								name="canAccess"
								value="lab"
								defaultChecked={canAccessLab}
							/>
						)}
						{showAccessSchoolib && (
							<FormSwitch
								label="SCHOOLIB Zugriff"
								helper="Ob dieser Nutzer auf Schoolib zugreifen darf"
								name="canAccess"
								value="schoolib"
								defaultChecked={canAccessSchoolib}
							/>
						)}
					</SimpleGrid>
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
