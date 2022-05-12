import type { ActionFunction, LoaderFunction } from "remix";
import { CheckIcon } from "@chakra-ui/icons";
import {
	Heading,
	Text,
	chakra,
	VStack,
	Radio,
	RadioGroup,
	Box,
	useColorModeValue,
	HStack,
} from "@chakra-ui/react";
import { withZod } from "@remix-validated-form/with-zod";
import { useState } from "react";
import { ValidatedForm, validationError } from "remix-validated-form";
import { UserData } from "~models";
import { authorize } from "~feat/auth";
import { SubmitButton } from "~feat/form";
import { LinkButton } from "~feat/links";
import { prisma } from "~lib/prisma";
import { respond, useActionResponse, useLoaderResponse } from "~lib/response";

const UserValidatorData = UserData.pick({
	pizzaUUID: true,
});
const UserValidator = withZod(UserValidatorData);

type LoaderData = {
	headers: HeadersInit;
	pizzas: {
		price: string;
		name: string;
		uuid: string;
	}[];
	pizzaUUID?: string | null;
	status: number;
};
const getLoaderData = async (request: Request): Promise<LoaderData> => {
	const [{ pizzaUUID }, headers] = await authorize(request, { lab: true });

	const pizzas = (
		await prisma.pizza.findMany({
			orderBy: {
				price: "asc",
			},
			select: {
				name: true,
				price: true,
				uuid: true,
			},
		})
	).map(({ price, ...data }) => ({ ...data, price: price.toFixed(2) }));

	return {
		headers,
		pizzas,
		pizzaUUID,
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
	const [{ did }, headers] = await authorize(request, { lab: true });

	const form = await request.formData();
	const { error, data } = await UserValidator.validate(form);
	if (error) throw validationError(error);

	await prisma.user.update({
		data,
		select: {
			uuid: true,
		},
		where: {
			did,
		},
	});

	return {
		headers,
		status: 200,
	};
};
export const action: ActionFunction = async ({ request }) =>
	respond<ActionData>(await getActionData(request));

export default function Pizza(): JSX.Element {
	const { pizzas, pizzaUUID } = useLoaderResponse<LoaderData>();
	const { formError } = useActionResponse<ActionData>();
	const [pizza, setPizza] = useState(pizzaUUID);
	const checkColor = useColorModeValue("green.600", "green.400");

	return (
		<chakra.main w="full">
			<Heading as="h1" size="xl">
				Pizza
			</Heading>
			<Text fontSize="md" mt={2}>
				Bestellung für den nächsten Freitag abgeben
			</Text>
			<ValidatedForm validator={UserValidator} method="post">
				<RadioGroup
					onChange={setPizza}
					value={pizza || undefined}
					my={4}
					name="pizzaUUID">
					<VStack>
						{pizzas.map(({ name, price, uuid }) => (
							<Box w="full" key={uuid}>
								<Radio value={uuid}>
									{name} ({price}€){" "}
									{pizzaUUID === uuid && (
										<CheckIcon mr={2} color={checkColor} />
									)}
								</Radio>
							</Box>
						))}
					</VStack>
				</RadioGroup>
				<HStack spacing={4} mt={4}>
					<SubmitButton m={0}>:D</SubmitButton>
					<LinkButton href="./new" variant="outline">
						Neu
					</LinkButton>
				</HStack>
			</ValidatedForm>
			{formError && (
				<Text maxW="2xl" fontSize="md" color="red.400">
					{formError}
				</Text>
			)}
		</chakra.main>
	);
}
