import type { LoaderFunction } from "remix";
import { Outlet } from "remix";
import { Nav } from "~tree";
import { PrismaClient as prisma } from "~app/prisma";
import { respond, useLoaderResponse } from "~app/util";

type LoaderData = {
	groupedPages: {
		pages: {
			id: number;
			title: string;
		}[];
		id: number;
		name: string;
	}[];
	status: number;
};
const getLoaderData = async (): Promise<LoaderData> => {
	const groupedPages = await prisma.pageCategory.findMany({
		select: {
			id: true,
			name: true,
			pages: {
				select: {
					id: true,
					title: true,
				},
			},
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

	return (
		<>
			<Nav groupedPages={groupedPages} height="52px" />
			<Outlet />
		</>
	);
}
