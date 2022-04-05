import { Heading } from "@chakra-ui/react";
import { json, LoaderFunction, useLoaderData } from "remix";
import { authorize } from "~app/auth";
import { users } from "~app/models";

const getLoaderData = async (request: Request) => {
	const { uuid } = await authorize(request);
	return users().getMany(uuid, ["firstname", "lastname"]);
};
type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;
export const loader: LoaderFunction = async ({ request }) =>
	json<LoaderData>(await getLoaderData(request));

export default function Index(): JSX.Element {
	const { firstname, lastname } = useLoaderData<LoaderData>();

	return (
		<Heading p={8}>
			Hallo {firstname} {lastname} 👋
		</Heading>
	);
}

export const url = "/admin/lab";
