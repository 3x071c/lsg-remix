import type { LoaderFunction } from "remix";
import { Portal } from "@chakra-ui/react";
import { useContext } from "react";
import { Outlet } from "remix";
import { authorize } from "~feat/auth";
import { HeaderPortalContext } from "~feat/headerportal";
import { Nav } from "~feat/nav";
import { prisma } from "~lib/prisma";
import { respond, useLoaderResponse } from "~lib/response";

type LoaderData = {
	groupedPages: {
		pages: {
			uuid: string;
			title: string;
		}[];
		uuid: string;
		name: string;
	}[];
	isLoggedIn: boolean;
	status: number;
};
const getLoaderData = async (request: Request): Promise<LoaderData> => {
	const user = await authorize(request, {
		ignore: true,
		lock: true,
		required: false,
	});
	const isLoggedIn = !!user;

	const groupedPages = await prisma.pageCategory.findMany({
		select: {
			name: true,
			pages: {
				select: {
					title: true,
					uuid: true,
				},
			},
			uuid: true,
		},
	});

	return {
		groupedPages,
		isLoggedIn,
		status: 200,
	};
};
export const loader: LoaderFunction = async ({ request }) =>
	respond<LoaderData>(await getLoaderData(request));

export default function Pages() {
	const { groupedPages, isLoggedIn } = useLoaderResponse<LoaderData>();
	const headerPortal = useContext(HeaderPortalContext);

	return (
		<>
			<Portal containerRef={headerPortal}>
				<Nav groupedPages={groupedPages} isLoggedIn={isLoggedIn} />
			</Portal>
			<Outlet />
		</>
	);
}
