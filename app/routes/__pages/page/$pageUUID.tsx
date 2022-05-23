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
import { last } from "lodash";
import { useCatch } from "remix";
import { parse } from "superjson";
import type { Page } from "~models";
import {
	CatchBoundary as NestedCatchBoundary,
	ErrorBoundary as NestedErrorBoundary,
} from "~feat/boundaries";
import { maxContentWidth } from "~feat/chakra";
import { extensions } from "~feat/editor";
import { Link } from "~feat/links";
import { catchMessage } from "~lib/catch";
import { prisma } from "~lib/prisma";
import { respond, useLoaderResponse } from "~lib/response";
import { sanitize } from "~lib/sanitize";

const getUUID = (params: Params) => {
	const uuid = params["pageUUID"];
	if (!uuid)
		throw new Response("Invalider Seitenaufruf", {
			status: 400,
		});
	return uuid;
};

type LoaderData = Pick<z.infer<typeof Page>, "title"> & {
	headers: HeadersInit;
	json: JSONContent;
	status: number;
};
const getLoaderData = async (params: Params): Promise<LoaderData> => {
	const uuid = getUUID(params);

	const page = await prisma.page.findUnique({
		where: {
			uuid,
		},
	});
	if (!page)
		throw new Response("Diese Seite existiert nicht", {
			status: 404,
		});

	const json = parse<JSONContent>(page.content);

	return { headers: {}, json, status: 200, title: page.title };
};
export const loader: LoaderFunction = async ({ params }) =>
	respond<LoaderData>(await getLoaderData(params));

export default function PageSlug() {
	const { title, json } = useLoaderResponse<LoaderData>();
	const html = sanitize(generateHTML(json, extensions));
	const headingRegex = /<h(?<tag>.+?)>(?<heading>.+?)<\/h/g;
	const htmlWithHeadingIds = html.replaceAll(
		headingRegex,
		(...args) =>
			`<h${(last(args) as Record<string, string>)?.["tag"] ?? "6"} id="${
				(last(args) as Record<string, string>)?.["heading"] ?? ""
			}">${(last(args) as Record<string, string>)?.["heading"] ?? ""}</h`,
	);
	const readingTime = Math.ceil((html.match(/\s+/g)?.length ?? 0) / 150);

	return (
		<Container w="full" maxW={maxContentWidth} mx="auto" mt={16} p={4}>
			<Heading as="h1" size="2xl">
				{title}
			</Heading>
			<HStack spacing={2} mt={2} borderBottomWidth={1}>
				<TimeIcon />
				<Text fontSize="xl">
					{readingTime} Minute{readingTime !== 1 && "n"} Lesezeit
				</Text>
			</HStack>
			<Wrap
				spacingX={2}
				spacingY={4}
				justify="space-between"
				mt={8}
				sx={{
					"> *": {
						flexWrap: "wrap-reverse !important",
					},
				}}>
				<WrapItem minW={215} w="full" d="inline-block" flex="1 1 0">
					<Prose as="main">
						<Box
							dangerouslySetInnerHTML={{
								__html: htmlWithHeadingIds,
							}}
						/>
					</Prose>
				</WrapItem>
				<WrapItem
					minW="min-content"
					w={{ base: "full", md: 230 }}
					flex={{ md: "0 0 auto" }}>
					<Accordion
						as="aside"
						w={{ base: "full", md: 230 }}
						pos="sticky"
						top="calc(53px + 2rem)" /* TODO figure out how to make this dynamic, right now this is based on fixed calculations (what if the nav height changes? :O ) */
						borderRadius="lg"
						boxShadow="xl"
						allowToggle>
						<AccordionItem border="none">
							<AccordionButton>
								<Text
									flex="1"
									fontSize="xl"
									fontWeight="semibold"
									textAlign="left">
									Inhalt
								</Text>
								<AccordionIcon />
							</AccordionButton>
							<AccordionPanel borderTopWidth={1}>
								<VStack
									divider={<StackDivider />}
									spacing={2}
									align="stretch">
									<Box>
										{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
										<Link
											href="#"
											fontSize="lg"
											isTruncated>
											{title}
										</Link>
									</Box>
									{[...html.matchAll(headingRegex)].map(
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
														pl={2}
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

export function CatchBoundary(): JSX.Element {
	const caught = useCatch();
	// eslint-disable-next-line no-console -- Log the caught message
	console.error("⚠️ Caught:", caught);
	const { status, statusText } = caught;
	const message = catchMessage(status);

	return (
		<NestedCatchBoundary
			message={message}
			status={status}
			statusText={statusText}
		/>
	);
}

export function ErrorBoundary({ error }: { error: Error }): JSX.Element {
	// eslint-disable-next-line no-console -- Log the error message
	console.error("🚨 ERROR:", error);
	const { message } = error;

	return <NestedErrorBoundary message={message} name="Unterseite" />;
}
