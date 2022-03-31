import { LockIcon } from "@chakra-ui/icons";
import { Center, Heading } from "@chakra-ui/react";
import { json, LoaderFunction, useLoaderData } from "remix";
import { authorize } from "~app/auth";
import { LinkButton } from "~app/links";
import { users } from "~app/models";
import { url as logoutURL } from "~routes/admin/logout";

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
			<LinkButton
				href={logoutURL}
				size="lg"
				pos="fixed"
				top="20px"
				right="20px"
				zIndex={9}
				variant="outline"
				rightIcon={<LockIcon />}>
				Abmelden
			</LinkButton>
			<Center minW="100vw" minH="100vh">
				<Heading>
					Hallo {firstname} {lastname} 👋
				</Heading>
			</Center>
		</>
	);
}

export const url = "/admin";
