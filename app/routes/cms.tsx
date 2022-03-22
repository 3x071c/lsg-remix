import { Box, Flex } from "@chakra-ui/react";
import { json, LoaderFunction, Outlet, useLoaderData } from "remix";
import { authorize, logout } from "~app/auth";
import { CmsNavbar } from "~app/nav";

import { PrismaClient as prisma } from "~app/prisma";

export const getLoaderData = async (request: Request) => {
	const { id } = await authorize(request);

	const user = await prisma.user.findUnique({
		select: { firstname: true, lastname: true },
		where: { id },
	});

	if (!user) throw await logout(request);
	return user;
};

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;
export const loader: LoaderFunction = async ({ request }) =>
	json<LoaderData>(await getLoaderData(request));

export default function Index() {
	const { firstname, lastname } = useLoaderData<LoaderData>();

	return (
		<Flex w="100%" minH="100vh">
			<CmsNavbar fullName={`${firstname} ${lastname}`} />
			<Box flexGrow={1}>
				<Outlet />
			</Box>
		</Flex>
	);
}
