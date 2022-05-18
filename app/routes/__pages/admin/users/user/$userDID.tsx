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
import { redirect, useCatch } from "remix";
import { ValidatedForm, validationError } from "remix-validated-form";
import { zfd } from "zod-form-data";
import { User, UserData } from "~models";
import { authorize, safeMetadata } from "~feat/auth";
import {
	CatchBoundary as NestedCatchBoundary,
	ErrorBoundary as NestedErrorBoundary,
} from "~feat/boundaries";
import { FormSmartInput, FormSwitch, SubmitButton } from "~feat/form";
import { catchMessage } from "~lib/catch";
import { prisma } from "~lib/prisma";
import { respond, useActionResponse, useLoaderResponse } from "~lib/response";

const UserValidatorData = UserData.pick({
	firstname: true,
	lastname: true,
}).extend({
	canAccess: zfd.repeatable(),
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
	canAccessLocked: boolean;
	canAccessSchoolib: boolean;
	canAccessTicker: boolean;
	firstname?: string;
	headers: HeadersInit;
	lastname?: string;
	message: string;
	showAccessCMS: boolean;
	showAccessLab: boolean;
	showAccessLocked: boolean;
	showAccessSchoolib: boolean;
	showAccessTicker: boolean;
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
		canAccessTicker: showAccessTicker,
	} = user;

	let target: Partial<User> | null = null;
	if (did === user.did) {
		if (!user.uuid)
			return {
				canAccessCMS: false,
				canAccessLab: false,
				canAccessLocked: true,
				canAccessSchoolib: false,
				canAccessTicker: false,
				headers,
				message:
					"Willkommen! 👋 Um die Registration abzuschließen, müssen folgende Daten hinterlegt werden:",
				showAccessCMS: showAccessCMS ?? false,
				showAccessLab: showAccessLab ?? false,
				showAccessLocked: false,
				showAccessSchoolib: showAccessSchoolib ?? false,
				showAccessTicker: showAccessTicker ?? false,
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
			canAccessLocked: target.locked ?? false,
			canAccessSchoolib: target.canAccessSchoolib ?? false,
			canAccessTicker: target.canAccessTicker ?? false,
			firstname: target.firstname,
			headers,
			lastname: target.lastname,
			message:
				did === user.did
					? "Willkommen zurück! 🍻 Bitte überprüfen und ergänzen Sie ihre inzwischen unvollständigen Nutzerdaten."
					: "⚠️ Dieser Nutzer ist unvollständig, vor weiterer Aktivität müssen die Daten ergänzt werden",
			showAccessCMS: showAccessCMS ?? false,
			showAccessLab: showAccessLab ?? false,
			showAccessLocked: target.locked !== undefined && did !== user.did,
			showAccessSchoolib: showAccessSchoolib ?? false,
			showAccessTicker: showAccessTicker ?? false,
			status: 200,
		};
	}
	const {
		canAccessCMS,
		canAccessLab,
		canAccessSchoolib,
		canAccessTicker,
		firstname,
		locked: canAccessLocked,
		lastname,
	} = parsed.data;

	return {
		canAccessCMS: canAccessCMS ?? false,
		canAccessLab: canAccessLab ?? false,
		canAccessLocked,
		canAccessSchoolib: canAccessSchoolib ?? false,
		canAccessTicker: canAccessTicker ?? false,
		firstname,
		headers,
		lastname,
		message: "Einstellungen anpassen und Nutzerdaten aktualisieren",
		showAccessCMS: showAccessCMS ?? false,
		showAccessLab: showAccessLab ?? false,
		showAccessLocked: did !== user.did,
		showAccessSchoolib: showAccessSchoolib ?? false,
		showAccessTicker: showAccessTicker ?? false,
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
	const canAccessCMS = user.canAccessCMS
		? canAccess?.includes("cms")
		: undefined;
	const canAccessLab = user.canAccessLab
		? canAccess?.includes("lab")
		: undefined;
	const canAccessLocked =
		user.did !== did ? canAccess?.includes("locked") : undefined;
	const canAccessSchoolib = user.canAccessSchoolib
		? canAccess?.includes("schoolib")
		: undefined;
	const canAccessTicker = user.canAccessTicker
		? canAccess?.includes("ticker")
		: undefined;

	const update = {
		canAccessCMS,
		canAccessLab,
		canAccessSchoolib,
		canAccessTicker,
		firstname,
		lastname,
		locked: canAccessLocked,
	};

	await prisma.user.upsert({
		create: {
			...update,
			did,
			email,
		},
		select: { uuid: true },
		update,
		where: { did },
	});

	throw redirect("/admin/users", {
		headers,
	});
};
export const action: ActionFunction = async ({ request, params }) =>
	respond<ActionData>(await getActionData(request, params));

export default function AdminUser() {
	const {
		canAccessCMS,
		canAccessLab,
		canAccessLocked,
		canAccessSchoolib,
		canAccessTicker,
		firstname,
		lastname,
		message,
		showAccessCMS,
		showAccessLab,
		showAccessLocked,
		showAccessSchoolib,
		showAccessTicker,
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
						{showAccessLocked && (
							<FormSwitch
								label="Sperre"
								helper="Ob dieser Nutzer aus der Benutzung der Applikation gesperrt wurde"
								name="canAccess"
								value="locked"
								defaultChecked={canAccessLocked}
							/>
						)}
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
						{showAccessTicker && (
							<FormSwitch
								label="Ticker Zugriff"
								helper="Ob dieser Nutzer den Inhalt des Tickers modifizieren darf"
								name="canAccess"
								value="ticker"
								defaultChecked={canAccessTicker}
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

export function CatchBoundary(): JSX.Element {
	const caught = useCatch();
	// eslint-disable-next-line no-console -- Log the caught message
	console.error("⚠️ Caught:", caught);
	const { status, statusText } = caught;
	const message = catchMessage(status);

	return (
		<NestedCatchBoundary
			message={message}
			status={status}
			statusText={statusText}
		/>
	);
}

export function ErrorBoundary({ error }: { error: Error }): JSX.Element {
	// eslint-disable-next-line no-console -- Log the error message
	console.error("🚨 ERROR:", error);
	const { message } = error;

	return <NestedErrorBoundary message={message} name="Nutzeransicht" />;
}
