import {
	Center,
	VStack,
	Heading,
	Text,
	useColorModeValue,
	chakra,
} from "@chakra-ui/react";
import { withZod } from "@remix-validated-form/with-zod";
import { ActionFunction, json, useActionData } from "remix";
import { ValidatedForm, validationError } from "remix-validated-form";
import { zfd } from "zod-form-data";
import {
	createUserSession,
	verifyPassword,
	hashPassword,
	shouldRehashPassword,
} from "~app/auth";
import { FormInput, SubmitButton } from "~app/form";
import { PrismaClient as prisma } from "~app/prisma";

const validator = withZod(
	zfd.formData({
		password: zfd.text(),
		username: zfd.text(),
	}),
);

type ActionData = {
	formError?: string;
};
export const action: ActionFunction = async ({ request }) => {
	const { error, data } = await validator.validate(await request.formData());
	if (error || !data) return validationError(error);
	const { username, password } = data;

	const { id, password: passwordHash } = (await prisma.user.findUnique({
		select: {
			id: true,
			password: true,
		},
		where: {
			username,
		},
	})) ?? { id: undefined, password: undefined };

	if (
		!(await verifyPassword(
			password,
			passwordHash ??
				"$argon2i$v=19$m=4096,t=3,p=1$UFp3ZFmnUdIc84t1M7zpXQ$o+I1FxwYr0ulRgG4epYb+EIWxI/g8lEiLXTv4Ps1W8k",
		)) ||
		!passwordHash
	)
		return json({ formError: "Invalid username or password" }, 401);

	if (shouldRehashPassword(passwordHash)) {
		await prisma.user.update({
			data: {
				password: await hashPassword(password),
			},
			where: {
				id,
			},
		});
	}

	return createUserSession(id, "/cms");
};

export default function Login() {
	const actionData = useActionData<ActionData>();
	const background = useColorModeValue("gray.300", "gray.700");

	return (
		<Center minW="100vw" minH="100vh">
			<chakra.main p={8} rounded="md" bg={background}>
				<ValidatedForm validator={validator} method="post">
					<Heading textAlign="center">Login</Heading>
					<VStack spacing={2}>
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
					<SubmitButton w="100%" mt={2}>
						Login
					</SubmitButton>
				</ValidatedForm>
			</chakra.main>
		</Center>
	);
}
