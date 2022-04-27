import type { ActionFunction, LoaderFunction } from "remix";
import {
	Heading,
	Wrap,
	WrapItem,
	chakra,
	useColorModeValue,
	Center,
	Text,
} from "@chakra-ui/react";
import { withZod } from "@remix-validated-form/with-zod";
import { redirect } from "remix";
import { ValidatedForm, validationError } from "remix-validated-form";
import { User } from "~models";
import { login as authenticate, useLogin, authorize } from "~feat/auth";
import { FormInput, SubmitButton } from "~feat/form";
import { respond, useActionResponse } from "~lib/response";

type LoaderData = {
	status: number;
};
const getLoaderData = async (request: Request): Promise<LoaderData> => {
	if (await authorize(request, { onboarding: true, required: false }))
		throw redirect("/admin");
	return { status: 200 };
};
export const loader: LoaderFunction = async ({ request }) =>
	respond<LoaderData>(await getLoaderData(request));

const validatorData = User.pick({
	firstname: true,
	lastname: true,
});
const validator = withZod(validatorData);

type ActionData = {
	formError?: string;
	status: number;
};
const getActionData = async (request: Request): Promise<ActionData> => {
	const form = await request.formData();
	const didToken = form.get("_authorization");
	const { error, data } = await validator.validate(form);
	if (error) throw validationError(error);

	try {
		await authenticate(request, didToken, data);
		return { status: 200 };
	} catch (e) {
		if (e instanceof Error) {
			const errorJSON = JSON.parse(e.message) as unknown;
			const parsed =
				errorJSON &&
				typeof errorJSON === "object" &&
				Array.isArray(errorJSON)
					? errorJSON
							.map((m) =>
								String(
									(m &&
										typeof m === "object" &&
										typeof (m as Record<string, unknown>)[
											"message"
										] !== "undefined" &&
										(m as Record<string, unknown>)[
											"message"
										]) ||
										false,
								),
							)
							.filter(Boolean)
							.join(", ")
					: false;

			return {
				formError: parsed || e.message,
				status: 400,
			};
		}
		throw e;
	}
};
export const action: ActionFunction = async ({ request }) =>
	respond<ActionData>(await getActionData(request));

export default function Onboard() {
	const actionData = useActionResponse<ActionData>();
	const background = useColorModeValue("gray.50", "gray.700");
	const { loading, data: token } = useLogin();

	return (
		<Center minW="100vw" minH="100vh">
			<Wrap spacing={8} justify="center" align="center">
				<WrapItem>
					<Heading as="h1" size="3xl">
						Hallo! 👋
					</Heading>
				</WrapItem>
				<WrapItem>
					<chakra.main minW="sm" p={8} rounded="md" bg={background}>
						<Heading as="h2" textAlign="center" mt={2}>
							Neuer Nutzer 🤩
						</Heading>
						<ValidatedForm validator={validator} method="post">
							{token && (
								<input
									type="hidden"
									name="_authorization"
									value={token}
								/>
							)}
							<FormInput
								type="text"
								name="firstname"
								placeholder="🔤 Vorname"
								helper="Ihr Vorname wurde noch nicht hinterlegt"
								label="Ihr Vorname"
								isDisabled={loading}
							/>
							<FormInput
								type="text"
								name="lastname"
								placeholder="🔤 Nachname"
								helper="Ihr Nachname wurde noch nicht hinterlegt"
								label="Ihr Nachname"
								isDisabled={loading}
							/>
							<SubmitButton
								w="full"
								isLoading={loading}
								isDisabled={loading}>
								Speichern
							</SubmitButton>
							{actionData.formError && (
								<Text maxW="sm" mt={2} color="red.400">
									Fehler: {String(actionData?.formError)}
								</Text>
							)}
						</ValidatedForm>
					</chakra.main>
				</WrapItem>
			</Wrap>
		</Center>
	);
}
