import type { LoaderFunction } from "remix";
import { Container, chakra } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "remix";
import { CmsNav } from "~feat/admin";
import { authorize } from "~feat/auth";
import { maxContentWidth } from "~feat/chakra";
import { respond, useLoaderResponse } from "~lib/response";

type LoaderData = {
	firstname: string;
	lastname: string;
	status: number;
};
const getLoaderData = async (request: Request): Promise<LoaderData> => {
	const { firstname, lastname } = await authorize(request);

	return {
		firstname,
		lastname,
		status: 200,
	};
};
export const loader: LoaderFunction = async ({ request }) =>
	respond<LoaderData>(await getLoaderData(request));

export const pages: {
	id: number;
	long: string;
	short: string;
	url: string;
}[] = [
	{
		id: 1,
		long: "Content Management System",
		short: "CMS",
		url: "/admin/cms",
	},
	{
		id: 2,
		long: "Schoolib",
		short: "schoolib",
		url: "/admin/schoolib",
	},
	{
		id: 3,
		long: "Admin Lab only 😎",
		short: "Lab",
		url: "/admin/lab",
	},
];
export default function Admin(): JSX.Element {
	const { firstname, lastname } = useLoaderResponse<LoaderData>();
	const location = useLocation();
	const [route, setRoute] = useState<string>(location.pathname);

	useEffect(() => {
		setRoute(location.pathname);
	}, [route, location.pathname]);

	return (
		<chakra.section pos="relative">
			<CmsNav
				firstname={firstname}
				lastname={lastname}
				top="52px"
				height="48px"
				pages={pages}
				page={
					pages.find(({ url }) => url.endsWith(route))?.short ??
					"Admin"
				}
			/>
			<chakra.section pos="relative">
				<Container
					w="full"
					maxW={maxContentWidth}
					mx="auto"
					py={8}
					centerContent>
					<Outlet />
				</Container>
			</chakra.section>
		</chakra.section>
	);
}
