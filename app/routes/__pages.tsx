import type { LoaderFunction } from "remix";
import { Portal } from "@chakra-ui/react";
import { useContext } from "react";
import { Outlet } from "remix";
import { HeaderPortalContext } from "~feat/headerPortal";
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
	status: number;
};
const getLoaderData = async (): Promise<LoaderData> => {
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
		status: 200,
	};
};
export const loader: LoaderFunction = async () =>
	respond<LoaderData>(await getLoaderData());

export default function Pages() {
	const { groupedPages } = useLoaderResponse<LoaderData>();
	const headerPortal = useContext(HeaderPortalContext);

	return (
		<>
			<Portal containerRef={headerPortal}>
				<Nav groupedPages={groupedPages} />
			</Portal>
			<Outlet />
		</>
	);
}
