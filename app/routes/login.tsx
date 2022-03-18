import { Box } from "@chakra-ui/react";
import { ActionFunction, json } from "remix";
import { zfd } from "zod-form-data";
import { createUserSession, verifyPassword } from "~app/auth";
import { PrismaClient as prisma } from "~app/prisma";

const schema = zfd.formData({
	password: zfd.text(),
	username: zfd.text(),
});

export const login: ActionFunction = async ({ request }) => {
	const { username, password } = schema.parse(await request.formData());

	const user = await prisma.user.findUnique({ where: { username } });

	if (
		!(await verifyPassword(
			password,
			user?.password ??
				"$argon2i$v=19$m=4096,t=3,p=1$UFp3ZFmnUdIc84t1M7zpXQ$o+I1FxwYr0ulRgG4epYb+EIWxI/g8lEiLXTv4Ps1W8k",
		))
	) {
		return json({ formError: "Password or username is incorrect" }, 400);
	}

	return createUserSession(user!.id, "/cms");
};

export default function Login() {
	return <Box />;
}
