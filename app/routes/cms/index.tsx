import { Center, Heading } from "@chakra-ui/react";
import { json, LoaderFunction, useLoaderData } from "remix";
import { authorize, logout } from "~app/auth";
import { PrismaClient as prisma } from "~app/prisma";

const getLoaderData = async (request: Request) => {
	const { id } = await authorize(request);

	const user = await prisma.user.findUnique({
		select: {
			firstname: true,
			lastname: true,
		},
		where: {
			id,
		},
	});

	if (!user) throw await logout(request);
	return user;
};
type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;
export const loader: LoaderFunction = async ({ request }) =>
	json<LoaderData>(await getLoaderData(request));

export default function Index(): JSX.Element {
	const { firstname, lastname } = useLoaderData<LoaderData>();

	return (
		<Center minH="100%" minW="100%">
			<Heading m={2}>
				Hallo {firstname} {lastname} 👋
			</Heading>
		</Center>
	);
}

export const url = "/cms";
