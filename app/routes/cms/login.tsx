import {
	Center,
	VStack,
	Heading,
	Text,
	useColorModeValue,
	chakra,
} from "@chakra-ui/react";
import { withZod } from "@remix-validated-form/with-zod";
import { ActionFunction, json, LoaderFunction, useActionData } from "remix";
import { ValidatedForm, validationError } from "remix-validated-form";
import { zfd } from "zod-form-data";
import {
	login,
	verifyPassword,
	hashPassword,
	shouldRehashPassword,
	authorize,
	toCMS,
} from "~app/auth";
import { FormInput, SubmitButton } from "~app/form";
import { users } from "~app/models";

const validator = withZod(
	zfd.formData({
		email: zfd.text(),
		password: zfd.text(),
	}),
);

const getLoaderData = async (request: Request) => {
	if (await authorize(request, { required: false })) throw toCMS();
	return {};
};
type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;
export const loader: LoaderFunction = async ({ request }) =>
	json<LoaderData>(await getLoaderData(request));

const getActionData = async (request: Request, env: AppLoadContextEnvType) => {
	await getLoaderData(request);

	const { error, data } = await validator.validate(await request.formData());
	if (error) throw validationError(error);
	const { email, password } = data;

	const userEnv = users(env);
	const uuids = (await userEnv.listValues("email")).data
		.map(({ uuid, value }) => (value === email ? uuid : false))
		.filter(Boolean);
	if (uuids.length > 1) throw new Error("Unexpected State");
	const uuid = uuids?.[0] as string | undefined;

	const { password: passwordHash } = uuid
		? await userEnv.getMany(uuid, ["password"], 60)
		: {
				password:
					"$argon2i$v=19$m=4096,t=3,p=1$UFp3ZFmnUdIc84t1M7zpXQ$o+I1FxwYr0ulRgG4epYb+EIWxI/g8lEiLXTv4Ps1W8k",
		  };
	if (!(await verifyPassword(password, passwordHash)) || !uuid)
		return { formError: "Invalid email or password" };

	if (shouldRehashPassword(passwordHash))
		await userEnv.update({ password: await hashPassword(password), uuid });

	throw await login(request, {
		uuid,
	});
};
type ActionData = Awaited<ReturnType<typeof getActionData>>;
export const action: ActionFunction = async ({ request, context: { env } }) =>
	json<ActionData>(
		await getActionData(request, env as AppLoadContextEnvType),
		401,
	);

export default function Login(): JSX.Element {
	const actionData = useActionData<ActionData>();
	const background = useColorModeValue("gray.50", "gray.700");

	return (
		<Center minW="100vw" minH="100vh">
			<chakra.main p={8} rounded="md" bg={background}>
				<ValidatedForm validator={validator} method="post">
					<Heading textAlign="center">Login</Heading>
					<VStack spacing={2}>
						<Text color="red.400">{actionData?.formError}</Text>
						<FormInput
							name="email"
							placeholder="email"
							label="email"
						/>
						<FormInput
							type="password"
							name="password"
							placeholder="password"
							label="Password"
						/>
					</VStack>
					<SubmitButton w="100%" mt={2}>
						Login
					</SubmitButton>
				</ValidatedForm>
			</chakra.main>
		</Center>
	);
}

export const url = "/cms/login";
