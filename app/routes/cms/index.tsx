import { Center, Heading } from "@chakra-ui/react";
import { json, LoaderFunction, useLoaderData } from "remix";
import { authorize } from "~app/auth";
import { PrismaClient as prisma } from "~app/prisma";

const getLoaderData = async (request: Request) => {
	return prisma.user.findUnique({
		select: {
			firstname: true,
			lastname: true,
		},
		where: {
			id: (await authorize(request))?.id,
		},
	});
};
type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;
export const loader: LoaderFunction = async ({ request }) =>
	json<LoaderData>(await getLoaderData(request));

export default function Index(): JSX.Element {
	const loaderData = useLoaderData<LoaderData>();
	if (!loaderData) throw new Error("Unexpected Response");
	const { firstname, lastname } = loaderData;

	return (
		<Center minW="100vw" minH="100vh">
			<Heading>
				Hallo {firstname} {lastname} 👋
			</Heading>
		</Center>
	);
}

export const url = "/cms";
