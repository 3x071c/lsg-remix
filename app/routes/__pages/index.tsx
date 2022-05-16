import type { LoaderFunction } from "remix";
import {
	Heading,
	Text,
	chakra,
	Container,
	useColorModeValue,
} from "@chakra-ui/react";
import { maxContentWidth } from "~feat/chakra";
import { Hero, Certificates } from "~feat/home";
import { LinkButton } from "~feat/links";
import { prisma } from "~lib/prisma";
import { respond, useLoaderResponse } from "~lib/response";

type LoaderData = {
	headers: HeadersInit;
	status: number;
	ticker?: string;
};
const getLoaderData = async (): Promise<LoaderData> => {
	const ticker = await prisma.ticker.findFirst({
		orderBy: {
			updatedAt: "desc",
		},
		select: {
			content: true,
		},
	});

	return { headers: {}, status: 200, ticker: ticker?.content };
};
export const loader: LoaderFunction = async () =>
	respond<LoaderData>(await getLoaderData());

export default function Index(): JSX.Element {
	const { ticker } = useLoaderResponse<LoaderData>();
	const grayColor = useColorModeValue("gray.700", "gray.300");

	return (
		<Container w="full" maxW={maxContentWidth} mx="auto" centerContent>
			<chakra.main w="full">
				<chakra.section py={8}>
					<Hero />
				</chakra.section>
				{ticker && (
					<chakra.section
						py={2}
						borderTopWidth={1}
						borderTopStyle="dashed">
						<Text
							py={2}
							fontSize="md"
							textAlign="center"
							color={grayColor}>
							{ticker}
						</Text>
					</chakra.section>
				)}
				<chakra.section
					py={8}
					borderTopWidth={1}
					borderTopStyle="dashed"
					borderBottomWidth={1}
					borderBottomStyle="dashed">
					<Certificates />
				</chakra.section>
				<chakra.section py={8} textAlign="center">
					<Heading as="h2" size="xl">
						Aktuelle Termine
					</Heading>
					<Text fontSize="lg">
						Alle demnächst anstehenden Termine des
						Louise-Schroeder-Gymnasiums:
					</Text>
					<LinkButton href="/" mt={4}>
						Zu allen Terminen
					</LinkButton>
				</chakra.section>
			</chakra.main>
		</Container>
	);
}
