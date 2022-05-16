import type { LoaderFunction } from "remix";
import { Container, chakra, Portal } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { Outlet, useLocation } from "remix";
import { CmsNav } from "~feat/admin";
import { authorize } from "~feat/auth";
import { maxContentWidth } from "~feat/chakra";
import { HeaderPortalContext } from "~feat/headerportal";
import { respond, useLoaderResponse } from "~lib/response";

export const getPages = ({
	canAccessCMS,
	canAccessLab,
	canAccessSchoolib,
	canAccessTicker,
	canAccessUsers,
}: {
	canAccessCMS?: boolean;
	canAccessLab?: boolean;
	canAccessSchoolib?: boolean;
	canAccessTicker?: boolean;
	canAccessUsers?: boolean;
}) => {
	return [
		{
			authorized: canAccessCMS,
			id: 1,
			long: "Content Management System",
			short: "CMS",
			url: "/admin/cms",
		},
		{
			authorized: canAccessLab,
			id: 2,
			long: "Admin Lab only 😎",
			short: "Lab",
			url: "/admin/lab",
		},
		{
			authorized: canAccessSchoolib,
			id: 3,
			long: "Schoolib",
			short: "schoolib",
			url: "/admin/schoolib",
		},
		{
			authorized: canAccessTicker,
			id: 4,
			long: "Ticker setzen",
			short: "Ticker",
			url: "/admin/ticker",
		},
		{
			authorized: canAccessUsers,
			id: 5,
			long: "Nutzerverwaltung",
			short: "Nutzer",
			url: "/admin/users",
		},
	];
};

type LoaderData = {
	did?: string;
	firstname?: string;
	headers: HeadersInit;
	lastname?: string;
	pages: {
		authorized?: boolean;
		hidden?: boolean;
		id: number;
		long: string;
		short: string;
		url: string;
	}[];
	status: number;
};
const getLoaderData = async (request: Request): Promise<LoaderData> => {
	const [
		{
			did,
			firstname,
			lastname,
			canAccessCMS,
			canAccessLab,
			canAccessSchoolib,
			canAccessTicker,
			canAccessUsers,
		},
		headers,
	] = await authorize(request, { ignore: true, lock: true });

	const pages = getPages({
		canAccessCMS,
		canAccessLab,
		canAccessSchoolib,
		canAccessTicker,
		canAccessUsers,
	});

	return {
		did,
		firstname,
		headers,
		lastname,
		pages,
		status: 200,
	};
};
export const loader: LoaderFunction = async ({ request }) =>
	respond<LoaderData>(await getLoaderData(request));

export default function Admin(): JSX.Element {
	const { did, firstname, lastname, pages } = useLoaderResponse<LoaderData>();
	const headerPortal = useContext(HeaderPortalContext);
	const location = useLocation();
	const [route, setRoute] = useState<string>(location.pathname);
	const current = pages.find(({ url }) => url.endsWith(route));

	useEffect(() => {
		setRoute(location.pathname);
	}, [route, location.pathname]);

	return (
		<chakra.section pos="relative">
			<Portal containerRef={headerPortal}>
				<CmsNav
					user={
						did && firstname && lastname
							? { did, firstname, lastname }
							: undefined
					}
					pages={pages.filter(
						({ hidden, authorized }) => authorized && !hidden,
					)}
					page={{
						short: current?.short ?? "Admin",
						url: current?.url ?? ".",
					}}
				/>
			</Portal>
			<chakra.section pos="relative">
				<Container
					w="full"
					maxW={maxContentWidth}
					mx="auto"
					py={8}
					centerContent>
					<Outlet />
				</Container>
			</chakra.section>
		</chakra.section>
	);
}
