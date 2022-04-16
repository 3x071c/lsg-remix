import type { LoaderFunction } from "remix";
import { Container, chakra } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Outlet, json, useLoaderData, useLocation } from "remix";
import { Nav as AdminNav } from "~app/admin";
import { authorize } from "~app/auth";
import { url as cmsURL } from "~routes/__pages/admin/cms";
import { url as adminURL } from "~routes/__pages/admin/index";
import { url as labURL } from "~routes/__pages/admin/lab";

const getLoaderData = async (request: Request) => {
	const { firstname, lastname } = await authorize(request);

	return {
		firstname,
		lastname,
	};
};
type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;
export const loader: LoaderFunction = async ({ request }) =>
	json<LoaderData>(await getLoaderData(request));

export const pages: {
	id: number;
	long: string;
	short: string;
	url: string;
}[] = [
	{ id: 1, long: "Content Management System", short: "CMS", url: cmsURL },
	{ id: 2, long: "Home", short: "Home", url: adminURL },
	{
		id: 3,
		long: "Admin Lab only 😎",
		short: "Lab",
		url: labURL,
	},
];
export default function Admin(): JSX.Element {
	const { firstname, lastname } = useLoaderData<LoaderData>();
	const location = useLocation();
	const [route, setRoute] = useState<string>(location.pathname);

	useEffect(() => {
		setRoute(location.pathname);
	}, [route, location.pathname]);

	return (
		<chakra.section pos="relative">
			<AdminNav
				firstname={firstname}
				lastname={lastname}
				top="53px"
				height="48px"
				pages={pages}
				page={
					pages.find(({ url }) => url.endsWith(route))?.short ??
					"<ERR>"
				}
			/>
			<chakra.section pos="relative">
				<Container w="full" maxW="7xl" mx="auto" py={8} centerContent>
					<Outlet />
				</Container>
			</chakra.section>
		</chakra.section>
	);
}
