import type { ActionFunction, LoaderFunction } from "remix";
import { Heading, Text, chakra } from "@chakra-ui/react";
import { withZod } from "@remix-validated-form/with-zod";
import { redirect } from "remix";
import { ValidatedForm, validationError } from "remix-validated-form";
import { zfd } from "zod-form-data";
import { PizzaData } from "~models";
import { authorize } from "~feat/auth";
import { SubmitButton, FormInput, FormNumberInput } from "~feat/form";
import { prisma } from "~lib/prisma";
import { respond, useActionResponse } from "~lib/response";

const PizzaValidatorData = PizzaData.omit({
	createdByUUID: true,
}).extend({
	price: zfd.numeric(PizzaData.shape.price),
});
const PizzaValidator = withZod(PizzaValidatorData);

type LoaderData = {
	headers: HeadersInit;
	status: number;
};
const getLoaderData = async (request: Request): Promise<LoaderData> => {
	const [, headers] = await authorize(request, { lab: true });

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
	const [{ uuid }, headers] = await authorize(request, { lab: true });

	const form = await request.formData();
	const { error, data } = await PizzaValidator.validate(form);
	if (error) throw validationError(error);

	await prisma.pizza.create({
		data: { ...data, createdByUUID: uuid },
		select: { uuid: true },
	});

	throw redirect("/admin/lab/pizza", { headers });
};
export const action: ActionFunction = async ({ request }) =>
	respond<ActionData>(await getActionData(request));

export default function NewPizza(): JSX.Element {
	const { formError } = useActionResponse<ActionData>();

	return (
		<chakra.main w="full">
			<Heading as="h1" size="xl">
				Pizza - Neu
			</Heading>
			<Text fontSize="md" mt={2}>
				Neue Pizza eintragen
			</Text>
			<ValidatedForm validator={PizzaValidator} method="post">
				<FormInput
					type="text"
					name="name"
					placeholder="🔤 Name"
					helper="Name der neuen Pizza"
					label="Der Name"
				/>
				<FormNumberInput
					name="price"
					helper="Preis der neuen Pizza"
					label="Der Preis"
					min={0}
					max={20}
					step={0.01}
					precision={2}
					allowMouseWheel
				/>
				<SubmitButton>Erstellen</SubmitButton>
			</ValidatedForm>
			{formError && (
				<Text maxW="2xl" fontSize="md" color="red.400">
					{formError}
				</Text>
			)}
		</chakra.main>
	);
}
