import type { JSONContent } from "@tiptap/react";
import type { Params } from "react-router";
import type { LoaderFunction } from "remix";
import type { z } from "zod";
import { TimeIcon } from "@chakra-ui/icons";
import {
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	useColorModeValue,
	Box,
	Text,
	AccordionIcon,
	Heading,
	HStack,
	Wrap,
	WrapItem,
	VStack,
	StackDivider,
	Container,
} from "@chakra-ui/react";
import { Prose } from "@nikolovlazar/chakra-ui-prose";
import { generateHTML } from "@tiptap/html";
import { parse } from "superjson";
import type { Page } from "~models";
import { maxContentWidth } from "~feat/chakra";
import { extensions } from "~feat/editor";
import { Link } from "~feat/links";
import { prisma } from "~lib/prisma";
import { respond, useLoaderResponse } from "~lib/response";
import { sanitize } from "~lib/sanitize";

type LoaderData = Pick<z.infer<typeof Page>, "title"> & {
	json: JSONContent;
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

	const json = parse<JSONContent>(page.content);

	return { json, status: 200, title: page.title };
};
export const loader: LoaderFunction = async ({ params }) =>
	respond<LoaderData>(await getLoaderData(params));

export default function PageSlug() {
	const { title, json } = useLoaderResponse<LoaderData>();
	const html = sanitize(generateHTML(json, extensions));
	const plain = useColorModeValue("white", "gray.800");
	const readingTime = Math.ceil((html.match(/\s+/g)?.length ?? 0) / 150);

	return (
		<Container
			w="full"
			maxW={maxContentWidth}
			p={4}
			mx="auto"
			mt={16}
			bg={plain}>
			<Heading as="h1" size="2xl">
				{title}
			</Heading>
			<HStack mt={2} spacing={2} borderBottomWidth={1}>
				<TimeIcon />
				<Text fontSize="xl">
					{readingTime} Minute{readingTime !== 1 && "n"} Lesezeit
				</Text>
			</HStack>
			<Wrap
				mt={8}
				spacingX={2}
				spacingY={4}
				justify="space-between"
				sx={{
					"> *": {
						flexWrap: "wrap-reverse !important",
					},
				}}>
				<WrapItem d="inline-block" flex="1 1 0" w="full" minW={215}>
					<Prose
						as="main"
						dangerouslySetInnerHTML={{ __html: html }}
					/>
				</WrapItem>
				<WrapItem
					w={{ base: "full", md: 230 }}
					minW="min-content"
					flex={{ md: "0 0 auto" }}>
					<Accordion
						as="aside"
						allowToggle
						w={{ base: "full", md: 230 }}
						pos="sticky"
						top="calc(0.25rem + 53px)"
						borderRadius="lg"
						boxShadow="xl">
						<AccordionItem border="none">
							<AccordionButton>
								<Text
									flex="1"
									textAlign="left"
									fontWeight="semibold"
									fontSize="xl">
									Inhalt
								</Text>
								<AccordionIcon />
							</AccordionButton>
							<AccordionPanel borderTopWidth={1}>
								<VStack
									align="stretch"
									spacing={2}
									divider={<StackDivider />}>
									{[
										...html.matchAll(
											/<h\d>(?<heading>.+?)<\/h/g,
										),
									].map(
										({ index, groups }) =>
											groups?.["heading"] && (
												<Box key={index}>
													<Link
														href={`#${groups[
															"heading"
														].replaceAll(
															/[^A-Z0-9]/gi,
															"-",
														)}`}
														fontSize="md"
														isTruncated>
														{groups["heading"]}
													</Link>
												</Box>
											),
									)}
								</VStack>
							</AccordionPanel>
						</AccordionItem>
					</Accordion>
				</WrapItem>
			</Wrap>
		</Container>
	);
}
