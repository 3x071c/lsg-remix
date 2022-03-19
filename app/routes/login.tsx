import { Center, VStack, Heading, Text } from "@chakra-ui/react";
import { withZod } from "@remix-validated-form/with-zod";
import { ActionFunction, json, useActionData } from "remix";
import { ValidatedForm, validationError } from "remix-validated-form";
import { zfd } from "zod-form-data";
import { createUserSession, verifyPassword } from "~app/auth";
import FormInput from "~app/form/FormInput";
import SubmitButton from "~app/form/SubmitButton";
import { PrismaClient as prisma } from "~app/prisma";

const validator = withZod(
	zfd.formData({
		password: zfd.text(),
		username: zfd.text(),
	}),
);

export const action: ActionFunction = async ({ request }) => {
	const fieldValues = await validator.validate(await request.formData());
	if (fieldValues.error) return validationError(fieldValues.error);
	const { username, password } = fieldValues.data;

	const user = await prisma.user.findUnique({ where: { username } });

	if (
		!verifyPassword(
			password,
			user?.password ??
				// cspell:disable-next-line
				"$2a$10$ctXCCuxt.yedpcwAS1kaw.xcC/OniG.FGOayPPEU9KKppw1wJGHGW",
		)
	) {
		return json({ formError: "Password or username is incorrect" }, 400);
	}

	return createUserSession(user!.id, "/cms");
};

type ActionData = {
	formError?: string;
};

export default function Login() {
	const actionData = useActionData<ActionData>();

	return (
		<Center h="100vh">
			<ValidatedForm validator={validator} method="post">
				<Heading textAlign="center" mb={5}>
					Login
				</Heading>
				<VStack spacing={5}>
					<Text color="red.400">{actionData?.formError}</Text>
					<FormInput
						name="username"
						placeholder="username"
						label="Username"
					/>
					<FormInput
						type="password"
						name="password"
						placeholder="password"
						label="Password"
					/>
				</VStack>
				<SubmitButton w="100%" mt={8}>
					Login
				</SubmitButton>
			</ValidatedForm>
		</Center>
	);
}
