import type { LoaderFunction } from "remix";
import { json, Outlet, useLoaderData } from "remix";
import { Nav } from "~app/nav";
import { PrismaClient as prisma } from "~app/prisma";

const getLoaderData = async () => {
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
	};
};
type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;
export const loader: LoaderFunction = async () =>
	json<LoaderData>(await getLoaderData());

export default function Pages() {
	const { groupedPages } = useLoaderData<LoaderData>();

	return (
		<>
			<Nav groupedPages={groupedPages} height="52px" />
			<Outlet />
		</>
	);
}
