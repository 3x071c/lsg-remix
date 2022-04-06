import { Container, chakra } from "@chakra-ui/react";
import { Outlet, json, LoaderFunction, useLoaderData } from "remix";
import { Nav as AdminNav } from "~app/admin";
import { authorize } from "~app/auth";
import { users } from "~app/models";

const getLoaderData = async (request: Request) => {
	const { uuid: userUUID } = await authorize(request);
	const { avatar, firstname, lastname } = await users().getMany(userUUID, [
		"avatar",
		"firstname",
		"lastname",
	]);

	return {
		avatar,
		firstname,
		lastname,
	};
};
type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;
export const loader: LoaderFunction = async ({ request }) =>
	json<LoaderData>(await getLoaderData(request));

export default function Admin(): JSX.Element {
	const { firstname, lastname, avatar } = useLoaderData<LoaderData>();

	return (
		<chakra.section pos="relative">
			<AdminNav
				firstname={firstname}
				lastname={lastname}
				top="53px"
				height="48px"
				avatar={avatar}
			/>
			<chakra.section pos="relative">
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
