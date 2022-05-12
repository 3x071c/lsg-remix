import type { LoaderFunction } from "remix";
import { chakra, Heading, Text } from "@chakra-ui/react";
import { redirect } from "remix";
import { authorize, commitSession, invalidate, revalidate } from "~feat/auth";
import { prisma } from "~lib/prisma";
import { respond } from "~lib/response";

type LoaderData = {
	status: number;
};
const getLoaderData = async (request: Request): Promise<LoaderData> => {
	const { did, locked } = await authorize(request, { lock: true });
	if (!locked) throw redirect("/admin");

	const user = await prisma.user.findUnique({
		select: { locked: true },
		where: { did },
	});
	if (!user) throw await invalidate(request);

	if (!user.locked) {
		const session = await revalidate(request, did);

		throw redirect("/admin", {
			headers: {
				"Set-Cookie": await commitSession(session),
			},
		});
	}

	return {
		status: 200,
	};
};
export const loader: LoaderFunction = async ({ request }) =>
	respond<LoaderData>(await getLoaderData(request));

export default function Locked(): JSX.Element {
	return (
		<chakra.main w="full">
			<Heading as="h1" size="2xl">
				Account ist aktuell gesperrt
			</Heading>
			<Text fontSize="lg" mt={2}>
				Dies kann daran liegen, dass ihr Nutzer suspendiert wurde.
				Außerdem müssen neue Nutzer zuerst intern freigegeben werden,
				bevor auf privilegierte Funktionen zugegriffen werden kann.
				Fragen Sie im Zweifel bei den Administratoren nach, und laden
				Sie die Seite neu.
			</Text>
		</chakra.main>
	);
}
