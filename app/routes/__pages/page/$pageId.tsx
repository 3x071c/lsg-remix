import type { Params } from "react-router";
import type { LoaderFunction } from "remix";
import type { z } from "zod";
import { chakra, Heading, useColorModeValue } from "@chakra-ui/react";
import { json, useLoaderData } from "remix";
import type { PageModel } from "~models";
import { Image } from "~app/image";
import { PrismaClient as prisma } from "~app/prisma";

type LoaderData = z.infer<typeof PageModel>;
const getLoaderData = async (params: Params): Promise<LoaderData> => {
	const id = Number(params["pageId"]);
	if (!id)
		throw new Response("Invalider Seitenaufruf", {
			status: 400,
		});
	const page = await prisma.page.findUnique({
		where: {
			id,
		},
	});
	if (!page)
		throw new Response("Diese Seite existiert nicht", {
			status: 404,
		});

	return page;
};
export const loader: LoaderFunction = async ({ params }) =>
	json<LoaderData>(await getLoaderData(params));

export default function PageSlug() {
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
				w="full"
				src={bg}
				alt="Louise-Schroeder-Gymnasium Außenansicht"
				priority
			/>
			<chakra.main
				pos="absolute"
				left={32}
				right={32}
				top={64}
				minH="100vh"
				bg={bg}>
				<Heading as="h2" size="xl" p={6}>
					{title}
				</Heading>
			</chakra.main>
		</chakra.section>
	);
}
