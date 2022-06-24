import type { ActionFunction, LoaderFunction } from "remix";
import { Heading, Container, useDisclosure } from "@chakra-ui/react";
import { DateTime } from "luxon";
import { useCatch } from "remix";
import { validationError } from "remix-validated-form";
import { EventData } from "~models";
import { authorize } from "~feat/auth";
import {
	CatchBoundary as NestedCatchBoundary,
	ErrorBoundary as NestedErrorBoundary,
} from "~feat/boundaries";
import { maxContentWidth } from "~feat/chakra";
import { EventModal, EventValidator } from "~feat/events/eventmodal";
import { EventTable } from "~feat/table";
import { catchMessage } from "~lib/catch";
import { locale, zone } from "~lib/globals";
import { prisma } from "~lib/prisma";
import { respond, useActionResponse, useLoaderResponse } from "~lib/response";

type TableType = {
	startsAt: Date;
	endsAt: Date;
	title: string;
};

type LoaderData = {
	canAccessEvents?: boolean;
	events: TableType[];
	headers: HeadersInit;
	status: number;
};
const getLoaderData = async (request: Request): Promise<LoaderData> => {
	const [user, headers] = await authorize(request, {
		bypass: true,
		required: false,
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

	return {
		canAccessEvents: user?.canAccessEvents,
		events,
		headers,
		status: 200,
	};
};
export const loader: LoaderFunction = async ({ request }) =>
	respond<LoaderData>(await getLoaderData(request));

type ActionData = {
	formError?: string;
	headers: HeadersInit;
	status: number;
};
const getActionData = async (request: Request): Promise<ActionData> => {
	const [{ uuid }, headers] = await authorize(request, { events: true });

	const form = await request.formData();
	const { error, data: formData } = await EventValidator.validate(form);
	if (error) throw validationError(error);

	const event = EventData.safeParse({
		createdByUUID: uuid,
		endsAt: DateTime.fromISO(formData.endsAt, { locale, zone }).toJSDate(),
		startsAt: DateTime.fromISO(formData.startsAt, {
			locale,
			zone,
		}).toJSDate(),
		title: formData.title,
	});
	if (!event.success)
		throw new Response("Termin konnte nicht validiert werden", {
			status: 400,
			statusText: "Schlechte Anfrage",
		});

	await prisma.event.create({
		data: event.data,
	});

	return {
		headers,
		status: 200,
	};
};
export const action: ActionFunction = async ({ request }) =>
	respond<ActionData>(await getActionData(request));

export default function Events() {
	const { canAccessEvents, events } = useLoaderResponse<LoaderData>();
	const { formError } = useActionResponse<ActionData>();
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<Container w="full" maxW={maxContentWidth} p={4} mx="auto" mt={16}>
			<Heading as="h1" size="2xl" borderBottomWidth={2}>
				Termine
			</Heading>
			<EventTable events={events} trigger={onOpen} />
			{canAccessEvents && (
				<EventModal
					isOpen={isOpen}
					onClose={onClose}
					errorMessage={formError}
				/>
			)}
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

	return <NestedErrorBoundary message={message} name="Termine" />;
}
