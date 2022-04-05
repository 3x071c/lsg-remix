import type { Params } from "react-router";
import { chakra, Heading, useColorModeValue } from "@chakra-ui/react";
import { json, LoaderFunction, useLoaderData } from "remix";
import { Image } from "~app/image";
import { pages } from "~app/models";

const getLoaderData = async (params: Params) => {
	const uuid = params["pageId"];
	if (!uuid)
		throw new Response("Diese Seite existiert nicht", {
			status: 404,
		});
	const { title } = await pages().getMany(uuid, ["title"]);
	return { title };
};
type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;
export const loader: LoaderFunction = async ({ params }) =>
	json<LoaderData>(await getLoaderData(params));

export default function Page() {
	const { title } = useLoaderData<LoaderData>();
	const bg = useColorModeValue("white", "gray.800");

	return (
		<chakra.section
			pos="relative"
			w="full"
			d="flex"
			justifyContent="center"
			alignItems="center">
			<Image
				id="9b9917b3-0fce-4ca5-0718-ca3e22794500"
				alt="Louise-Schroeder-Gymnasium Außenansicht"
				priority
				w="full"
			/>
			<chakra.main
				pos="absolute"
				left={32}
				right={32}
				top={64}
				minH="100vh"
				bg={bg}>
				<Heading size="xl" p={6}>
					{title}
				</Heading>
			</chakra.main>
		</chakra.section>
	);
}
