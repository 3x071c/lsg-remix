import type { ActionFunction, LoaderFunction } from "remix";
import { Heading, Text, chakra } from "@chakra-ui/react";
import { withZod } from "@remix-validated-form/with-zod";
import { redirect, useCatch } from "remix";
import { ValidatedForm, validationError } from "remix-validated-form";
import { TickerData } from "~models";
import { authorize } from "~feat/auth";
import {
	CatchBoundary as NestedCatchBoundary,
	ErrorBoundary as NestedErrorBoundary,
} from "~feat/boundaries";
import { SubmitButton, FormInput } from "~feat/form";
import { catchMessage } from "~lib/catch";
import { prisma } from "~lib/prisma";
import { respond, useActionResponse } from "~lib/response";

const TickerValidatorData = TickerData.omit({
	createdByUUID: true,
});
const TickerValidator = withZod(TickerValidatorData);

type LoaderData = {
	headers: HeadersInit;
	status: number;
};
const getLoaderData = async (request: Request): Promise<LoaderData> => {
	const [, headers] = await authorize(request, { ticker: true });

	return {
		headers,
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
	const [{ uuid }, headers] = await authorize(request, { ticker: true });

	const form = await request.formData();
	const { error, data } = await TickerValidator.validate(form);
	if (error) throw validationError(error);

	await prisma.ticker.create({
		data: { ...data, createdByUUID: uuid },
		select: { uuid: true },
	});

	throw redirect("/admin", { headers });
};
export const action: ActionFunction = async ({ request }) =>
	respond<ActionData>(await getActionData(request));

export default function Ticker(): JSX.Element {
	const { formError } = useActionResponse<ActionData>();

	return (
		<chakra.main w="full">
			<Heading as="h1" size="xl">
				Ticker - Neu
			</Heading>
			<Text mt={2} fontSize="md">
				Neuen Ticker veröffentlichen
			</Text>
			<ValidatedForm validator={TickerValidator} method="post">
				<FormInput
					type="text"
					name="content"
					label="Der Inhalt"
					helper="Inhalt des neuen Tickers"
					placeholder="✍️ Inhalt"
				/>
				<SubmitButton mt={2}>Erstellen</SubmitButton>
			</ValidatedForm>
			{formError && (
				<Text maxW="2xl" fontSize="md" color="red.400">
					{formError}
				</Text>
			)}
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

	return (
		<NestedErrorBoundary message={message} name="Ticker-Einstellungen" />
	);
}
