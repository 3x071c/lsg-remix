import type { Params } from "react-router";
import type { LoaderFunction } from "remix";
import type { z } from "zod";
import {
	Box,
	chakra,
	Container,
	Heading,
	useColorModeValue,
	Text,
} from "@chakra-ui/react";
import { bg } from "~assets";
import type { Page } from "~models";
import { maxContentWidth } from "~feat/chakra";
import { PrismaClient as prisma } from "~feat/prisma";
import { respond, useLoaderResponse } from "~lib/response";

type LoaderData = z.infer<typeof Page> & {
	status: number;
};
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

	return { ...page, status: 200 };
};
export const loader: LoaderFunction = async ({ params }) =>
	respond<LoaderData>(await getLoaderData(params));

export default function PageSlug() {
	const { title, content } = useLoaderResponse<LoaderData>();
	const plain = useColorModeValue("white", "gray.800");

	return (
		<Box
			w="full"
			minH="100vh"
			bgImg={`url('${bg}')`}
			bgRepeat="no-repeat"
			bgSize="100%">
			<Container w="full" maxW={maxContentWidth} mx="auto" centerContent>
				<chakra.main w="full" mt={16} bg={plain}>
					<Heading as="h2" size="xl" py={2}>
						{title}
					</Heading>
					<Text fontSize="md">{content}</Text>
				</chakra.main>
			</Container>
		</Box>
	);
}
