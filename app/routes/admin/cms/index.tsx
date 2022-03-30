import { Center, Heading } from "@chakra-ui/react";
import { json, LoaderFunction, useLoaderData } from "remix";
import { authorize } from "~app/auth";
import { Nav } from "~app/cms";
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
		<>
			<Nav fullName={`${firstname} ${lastname}`} />
			<Center minH="100%" minW="100%">
				<Heading m={2}>
					Hallo {firstname} {lastname} 👋
				</Heading>
			</Center>
		</>
	);
}

export const url = "/admin/cms";
