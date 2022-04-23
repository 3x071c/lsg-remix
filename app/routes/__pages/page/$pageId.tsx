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
	Container,
	Heading,
	Text,
	Flex,
	Center,
	Grid,
	OrderedList,
	ListItem,
	AccordionIcon,
} from "@chakra-ui/react";
import type { Page } from "~models";
import { maxContentWidth } from "~feat/chakra";
import { Image } from "~feat/image";
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

	const wordCount = content.replace(/[^\w ]/g, "").split(/\s+/).length;
	const readingTime = Math.floor(wordCount / 228) + 1;

	return (
		<Box w="full">
			<Container
				padding="0"
				w="full"
				maxW={maxContentWidth}
				mx="auto"
				centerContent>
				<Grid
					w="full"
					templateColumns={{
						base: "repeat(1, 1fr)",
						md: "repeat(2, 1fr)",
					}}>
					<Center>
						<Image
							borderRadius="md"
							src="https://lsg.musin.de/homepage/images/header-images/schulhof_mini.jpg"
						/>
					</Center>
					<Center>
						<Heading mt={4}>{title}</Heading>
					</Center>
				</Grid>
			</Container>
			<Container p={0} w="full" mt={8} mx="auto" maxW={maxContentWidth}>
				<Flex
					w="full"
					justify="space-between"
					direction={{ base: "column", md: "row" }}>
					<Accordion
						allowToggle
						zIndex={3}
						top={{ base: "52px", md: 16 }}
						bg={useColorModeValue("white", "gray.800")}
						mx={{ base: 0, md: 4 }}
						w={{ base: "full" }}
						px={{ base: 4, md: 6 }}
						py={4}
						borderRadius={{ base: "none", md: "lg" }}
						h="max-content"
						mb={8}
						position="sticky"
						boxShadow={{
							base: "none",
							md: "2xl",
						}}>
						<AccordionItem borderColor="transparent">
							<AccordionButton
								borderBottomWidth="2px"
								padding={0}>
								<Text
									mr={4}
									w="full"
									textAlign="start"
									fontWeight="semibold"
									fontSize="2xl">
									INHALTSVERZEICHNIS
								</Text>
								<AccordionIcon w={6} h={6} />
							</AccordionButton>
							<AccordionPanel padding={0}>
								<OrderedList fontSize="lg" mt={4} spacing={2}>
									<ListItem>
										It has been a long time. How have you
										been? I have been *really* busy being
										dead. You know, after you MURDERED ME?
									</ListItem>
									<ListItem>
										Could you just jump into that pit?
										There.That deadly pit.
									</ListItem>
									<ListItem>
										Yes, hello! No, we are not stopping!
									</ListItem>
									<ListItem>
										Well, this is the part where he kills us
									</ListItem>
									<ListItem>
										Oh. Hi. So. How are you holding up?
										BECAUSE I AM A POTATO!
									</ListItem>
									<ListItem>
										Maybe you should marry that thing since
										you love it so much. Do you want to
										marry it? WELL I WONT LET YOU. How does
										that feel?
									</ListItem>
									<ListItem>
										Remember before when I was talking about
										smelly garbage standing around being
										useless? That was a metaphor. I was
										actually talking about you. And I am
										sorry. You did not react at the time, so
										I was worried it sailed right over your
										head. Which would have made this apology
										seem insane. That is why I had to call
										you garbage a second time just now.
									</ListItem>
								</OrderedList>
							</AccordionPanel>
						</AccordionItem>
					</Accordion>
					<Box flexGrow={1} maxW="90ch" px={4}>
						<Flex borderBottomWidth="2px" alignItems="center">
							<TimeIcon w={5} h={5} mr={2} />
							<Text fontSize="xl">
								{readingTime} Minute{readingTime > 1 ? "n" : ""}{" "}
								Lesezeit
							</Text>
						</Flex>
						<Box mt={8}>
							<Text fontSize="lg">{content}</Text>
						</Box>
					</Box>
				</Flex>
			</Container>
		</Box>
	);
}
