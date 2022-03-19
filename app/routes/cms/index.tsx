import { Center, Heading } from "@chakra-ui/react";
import { json, LoaderFunction, useLoaderData } from "remix";
import { requireUserId } from "~app/auth";

export const loader: LoaderFunction = async ({ request }) => {
	return json({ userId: await requireUserId(request) });
};

interface LoaderData {
	userId: number;
}

export default function Index() {
	const { userId } = useLoaderData<LoaderData>();

	return (
		<Center h="100vh">
			<Heading>Hello User {userId}</Heading>
		</Center>
	);
}
