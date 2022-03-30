import { Center, Heading, Wrap, WrapItem } from "@chakra-ui/react";
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
		<Wrap maxW="100%">
			<WrapItem flex="none">
				<Nav fullName={`${firstname} ${lastname}`} />
			</WrapItem>
			<WrapItem flex="1 1 auto">
				<Center h="full">
					<Heading m={2}>
						Hallo {firstname} {lastname} 👋
					</Heading>
				</Center>
			</WrapItem>
		</Wrap>
	);
}

export const url = "/admin/cms";
