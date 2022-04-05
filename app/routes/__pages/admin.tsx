import { LockIcon } from "@chakra-ui/icons";
import { Container, chakra } from "@chakra-ui/react";
import { Outlet, json, LoaderFunction, useLoaderData } from "remix";
import { Nav as AdminNav } from "~app/admin";
import { authorize } from "~app/auth";
import { LinkButton } from "~app/links";
import { users } from "~app/models";
import { url as logoutURL } from "~routes/__auth/logout";

const getLoaderData = async (request: Request) => {
	const { uuid: userUUID } = await authorize(request);
	const { firstname, lastname } = await users().getMany(userUUID, [
		"firstname",
		"lastname",
	]);

	return {
		firstname,
		lastname,
	};
};
type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;
export const loader: LoaderFunction = async ({ request }) =>
	json<LoaderData>(await getLoaderData(request));

export default function Admin(): JSX.Element {
	const { firstname, lastname } = useLoaderData<LoaderData>();

	return (
		<chakra.section pos="relative">
			<AdminNav active="CMS" username={`${firstname} ${lastname}`} />
			<chakra.section pos="relative">
				<LinkButton
					href={logoutURL}
					size="lg"
					pos="fixed"
					float="right"
					right="20px"
					top="120px"
					variant="outline"
					rightIcon={<LockIcon />}>
					Abmelden
				</LinkButton>
				<Container
					w="full"
					maxW="7xl"
					mx="auto"
					py={8}
					pb="10000px"
					centerContent>
					<Outlet />
				</Container>
			</chakra.section>
		</chakra.section>
	);
}
