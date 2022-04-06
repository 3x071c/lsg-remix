import { json, LoaderFunction, Outlet, useLoaderData } from "remix";
import { pages, pageGroups } from "~app/models";
import { Nav } from "~app/nav";
import { fromEntries } from "~app/util";

const getLoaderData = async () => {
	const { data: pageGroupNames } = await pageGroups().listValues("name");
	const { data: pageTitles } = await pages().listValues("title");

	const groupedPages = fromEntries<{
		[groupUUID: string]: {
			name: string;
			pages: {
				[pageUUID: string]: {
					title: string;
				};
			};
		};
	}>(
		pageGroupNames.map(({ value: name, uuid }) => [
			uuid,
			{
				name,
				pages: {},
			},
		]),
	);
	await Promise.all(
		pageTitles.map(async ({ value: title, uuid }) => {
			const { groupRef } = await pages().getMany(uuid, ["groupRef"]);
			const group = groupedPages[groupRef];
			if (!group)
				throw new Error(`Dangling groupRef (${groupRef}) in ${uuid}`);
			const groupPage = {
				title,
			};
			group.pages[uuid] = groupPage;
		}),
	);

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
