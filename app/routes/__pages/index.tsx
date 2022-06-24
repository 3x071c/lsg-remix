import type { LoaderFunction } from "remix";
import {
	Heading,
	Text,
	chakra,
	Container,
	useColorModeValue,
} from "@chakra-ui/react";
import { DateTime } from "luxon";
import { useCatch } from "remix";
import {
	ErrorBoundary as NestedErrorBoundary,
	CatchBoundary as NestedCatchBoundary,
} from "~feat/boundaries";
import { maxContentWidth } from "~feat/chakra";
import { Hero, Certificates } from "~feat/home";
import { LinkButton } from "~feat/links";
import { EventTable } from "~feat/table";
import { catchMessage } from "~lib/catch";
import { prisma } from "~lib/prisma";
import { respond, useLoaderResponse } from "~lib/response";

type TableType = {
	startsAt: Date;
	endsAt: Date;
	title: string;
};

type LoaderData = {
	headers: HeadersInit;
	events: TableType[];
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

	const events = await prisma.event.findMany({
		orderBy: {
			startsAt: "asc",
		},
		select: {
			endsAt: true,
			startsAt: true,
			title: true,
		},
		where: {
			endsAt: {
				gte: DateTime.now().startOf("minute").toJSDate(),
			},
		},
	});

	return { events, headers: {}, status: 200, ticker: ticker?.content };
};
export const loader: LoaderFunction = async () =>
	respond<LoaderData>(await getLoaderData());

export default function Home(): JSX.Element {
	const { events, ticker } = useLoaderResponse<LoaderData>();
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
					<EventTable events={events} />
					<LinkButton href="/events" mt={4}>
						Zu allen Terminen
					</LinkButton>
				</chakra.section>
			</chakra.main>
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

	return <NestedErrorBoundary message={message} name="Startseite" />;
}
