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
import { json, useActionData, redirect } from "remix";
import { ValidatedForm, validationError } from "remix-validated-form";
import { login as authenticate, useLogin, authorize } from "~app/auth";
import { FormInput, SubmitButton } from "~app/form";
import { UserData } from "~app/models";
import { entries } from "~app/util";
import { url as adminURL } from "~routes/__pages/admin/index";

const getLoaderData = async (request: Request) => {
	if (await authorize(request, { required: false })) throw redirect(adminURL);
	return {};
};
type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;
export const loader: LoaderFunction = async ({ request }) =>
	json<LoaderData>(await getLoaderData(request));

const validatorData = UserData;
const validator = withZod(validatorData);

const getActionData = async (request: Request) => {
	const form = await request.formData();
	const didToken = form.get("_authorization");
	const { error, data } = await validator.validate(form);
	if (error) throw validationError(error);

	return authenticate(request, didToken, data).catch((e) => {
		if (e instanceof Error)
			return {
				formError: (JSON.parse(e.message) as { message: string }[])
					.map((m) => m.message)
					.join(", "),
			};
		throw e;
	});
};
type ActionData = Awaited<ReturnType<typeof getActionData>>;
export const action: ActionFunction = async ({ request }) =>
	json<ActionData>(await getActionData(request), 401);

export default function Onboard() {
	const actionData = useActionData<ActionData>();
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
							{entries(validatorData.shape).map(
								([name, { description: translated }]) => (
									<FormInput
										type="text"
										name={name}
										placeholder={String(translated)}
										helper={`Ihr ${String(
											translated,
										)} wurde noch nicht hinterlegt`}
										label={`Ihr ${String(translated)}`}
										key={name}
										isDisabled={loading}
									/>
								),
							)}
							<SubmitButton
								w="full"
								isLoading={loading}
								isDisabled={loading}>
								Speichern
							</SubmitButton>
							{actionData && (
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

export const url = "/onboard";
