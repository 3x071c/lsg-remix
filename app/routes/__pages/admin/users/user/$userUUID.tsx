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
import { authorize } from "~feat/auth";
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

const getUUID = (params: Params) => {
	const uuid = params["userUUID"];
	if (!uuid)
		throw new Response("Dieser Nutzer existiert nicht", {
			status: 404,
		});

	return uuid;
};

type LoaderData = {
	canAccessCMS: boolean;
	canAccessEvents: boolean;
	canAccessLab: boolean;
	canAccessLocked: boolean;
	canAccessSchoolib: boolean;
	canAccessTicker: boolean;
	firstname?: string;
	headers: HeadersInit;
	lastname?: string;
	message: string;
	showAccessCMS: boolean;
	showAccessEvents: boolean;
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
	const uuid = getUUID(params);
	const [user, headers] = await authorize(request, {
		bypass: true,
		user: uuid,
	});
	const {
		canAccessCMS: showAccessCMS,
		canAccessEvents: showAccessEvents,
		canAccessLab: showAccessLab,
		canAccessSchoolib: showAccessSchoolib,
		canAccessTicker: showAccessTicker,
	} = user;

	let target: Partial<User> | null = null;
	if (!user.uuid || uuid === user.uuid) {
		if (!user.uuid)
			return {
				canAccessCMS: false,
				canAccessEvents: false,
				canAccessLab: false,
				canAccessLocked: true,
				canAccessSchoolib: false,
				canAccessTicker: false,
				headers,
				message:
					"Willkommen! 👋 Um die Registration abzuschließen, müssen folgende Daten hinterlegt werden:",
				showAccessCMS: showAccessCMS ?? false,
				showAccessEvents: showAccessEvents ?? false,
				showAccessLab: showAccessLab ?? false,
				showAccessLocked: false,
				showAccessSchoolib: showAccessSchoolib ?? false,
				showAccessTicker: showAccessTicker ?? false,
				status: 200,
			};
		target = user;
	} else {
		target = await prisma.user.findUnique({ where: { uuid } });
	}
	if (!target) throw redirect(`/admin/users/user/${user.uuid}`, { headers });

	const parsed = User.safeParse(target);
	if (!parsed.success) {
		return {
			canAccessCMS: target.canAccessCMS ?? false,
			canAccessEvents: target.canAccessEvents ?? false,
			canAccessLab: target.canAccessLab ?? false,
			canAccessLocked: target.locked ?? false,
			canAccessSchoolib: target.canAccessSchoolib ?? false,
			canAccessTicker: target.canAccessTicker ?? false,
			firstname: target.firstname,
			headers,
			lastname: target.lastname,
			message:
				uuid === user.uuid
					? "Willkommen zurück! 🍻 Bitte überprüfen und ergänzen Sie ihre inzwischen unvollständigen Nutzerdaten."
					: "⚠️ Dieser Nutzer ist unvollständig, vor weiterer Aktivität müssen die Daten ergänzt werden",
			showAccessCMS: showAccessCMS ?? false,
			showAccessEvents: showAccessEvents ?? false,
			showAccessLab: showAccessLab ?? false,
			showAccessLocked: target.locked !== undefined && uuid !== user.uuid,
			showAccessSchoolib: showAccessSchoolib ?? false,
			showAccessTicker: showAccessTicker ?? false,
			status: 200,
		};
	}
	const {
		canAccessCMS,
		canAccessEvents,
		canAccessLab,
		canAccessSchoolib,
		canAccessTicker,
		firstname,
		locked: canAccessLocked,
		lastname,
	} = parsed.data;

	return {
		canAccessCMS: canAccessCMS ?? false,
		canAccessEvents: canAccessEvents ?? false,
		canAccessLab: canAccessLab ?? false,
		canAccessLocked,
		canAccessSchoolib: canAccessSchoolib ?? false,
		canAccessTicker: canAccessTicker ?? false,
		firstname,
		headers,
		lastname,
		message: "Einstellungen anpassen und Nutzerdaten aktualisieren",
		showAccessCMS: showAccessCMS ?? false,
		showAccessEvents: showAccessEvents ?? false,
		showAccessLab: showAccessLab ?? false,
		showAccessLocked: uuid !== user.uuid,
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
	const uuid = getUUID(params);
	const [user, headers] = await authorize(request, {
		bypass: true,
		user: uuid,
	});

	const form = await request.formData();
	const { error, data } = await UserValidator.validate(form);
	if (error) throw validationError(error);

	const { firstname, lastname, canAccess } = data;
	const canAccessCMS = user.canAccessCMS
		? canAccess?.includes("cms")
		: undefined;
	const canAccessEvents = user.canAccessEvents
		? canAccess?.includes("events")
		: undefined;
	const canAccessLab = user.canAccessLab
		? canAccess?.includes("lab")
		: undefined;
	const canAccessLocked =
		user.uuid !== uuid ? canAccess?.includes("locked") : undefined;
	const canAccessSchoolib = user.canAccessSchoolib
		? canAccess?.includes("schoolib")
		: undefined;
	const canAccessTicker = user.canAccessTicker
		? canAccess?.includes("ticker")
		: undefined;

	const update = {
		canAccessCMS,
		canAccessEvents,
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
		},
		select: { uuid: true },
		update,
		where: { uuid },
	});

	throw redirect("/admin/users", {
		headers,
	});
};
export const action: ActionFunction = async ({ request, params }) =>
	respond<ActionData>(await getActionData(request, params));

export default function UserConfiguration() {
	const {
		canAccessCMS,
		canAccessEvents,
		canAccessLab,
		canAccessLocked,
		canAccessSchoolib,
		canAccessTicker,
		firstname,
		lastname,
		message,
		showAccessCMS,
		showAccessEvents,
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
			<Text mt={2} mb={4} fontSize="lg">
				{message}
			</Text>
			<ValidatedForm validator={UserValidator} method="post">
				<VStack spacing={4}>
					<Box w="full">
						<FormSmartInput
							name="firstname"
							defaultValue={firstname}
							placeholder="❌ Vorname"
							label="Ihr Vorname"
							helper={`${
								firstname ? "" : "Wurde noch nicht hinterlegt! "
							}Ihr Vorname dient der Identitätserfassung und einer persönlicheren Nutzererfahrung.`}
							hint="Editieren ✍️"
							maxW={500}
							height={12}
							p={2}
							pl={0}
						/>
					</Box>
					<Box w="full">
						<FormSmartInput
							name="lastname"
							defaultValue={lastname}
							placeholder="❌ Nachname"
							label="Ihr Nachname"
							helper={`${
								lastname ? "" : "Wurde noch nicht hinterlegt! "
							}Ihr Nachname dient der Identitätserfassung und einer persönlicheren Nutzererfahrung.`}
							hint="Editieren ✍️"
							maxW={500}
							height={12}
							p={2}
							pl={0}
						/>
					</Box>
					<Box w="full">
						<SubmitButton mt={2}>Speichern</SubmitButton>
					</Box>
					<SimpleGrid minChildWidth={300} w="full">
						{showAccessLocked && (
							<FormSwitch
								name="canAccess"
								value="locked"
								label="Sperre"
								helper="Ob dieser Nutzer aus der Benutzung der Applikation gesperrt wurde"
								defaultChecked={canAccessLocked}
							/>
						)}
						{showAccessCMS && (
							<FormSwitch
								name="canAccess"
								value="cms"
								label="CMS Zugriff"
								helper="Ob dieser Nutzer auf das Content-Management-System zugreifen darf"
								defaultChecked={canAccessCMS}
							/>
						)}
						{showAccessEvents && (
							<FormSwitch
								name="canAccess"
								value="cms"
								label="TERMIN Zugriff"
								helper="Ob dieser Nutzer Termine publizieren und editieren darf"
								defaultChecked={canAccessEvents}
							/>
						)}
						{showAccessLab && (
							<FormSwitch
								name="canAccess"
								value="lab"
								label="LAB Zugriff"
								helper="Ob dieser Nutzer auf das Admin Lab zugreifen darf"
								defaultChecked={canAccessLab}
							/>
						)}
						{showAccessSchoolib && (
							<FormSwitch
								name="canAccess"
								value="schoolib"
								label="SCHOOLIB Zugriff"
								helper="Ob dieser Nutzer auf Schoolib zugreifen darf"
								defaultChecked={canAccessSchoolib}
							/>
						)}
						{showAccessTicker && (
							<FormSwitch
								name="canAccess"
								value="ticker"
								label="TICKER Zugriff"
								helper="Ob dieser Nutzer den Inhalt des Tickers modifizieren darf"
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
