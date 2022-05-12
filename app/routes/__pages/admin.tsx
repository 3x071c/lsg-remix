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
}: {
	canAccessCMS?: boolean;
	canAccessLab?: boolean;
	canAccessSchoolib?: boolean;
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
			authorized: canAccessSchoolib,
			id: 2,
			long: "Schoolib",
			short: "schoolib",
			url: "/admin/schoolib",
		},
		{
			authorized: canAccessLab,
			id: 3,
			long: "Admin Lab only 😎",
			short: "Lab",
			url: "/admin/lab",
		},
		{
			authorized: true,
			hidden: true,
			id: 4,
			long: "Nutzer",
			short: "Nutzer",
			url: "/admin/user",
		},
	];
};

type LoaderData = {
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
		{ firstname, lastname, canAccessCMS, canAccessLab, canAccessSchoolib },
		headers,
	] = await authorize(request, { ignore: true, lock: true });

	const pages = getPages({ canAccessCMS, canAccessLab, canAccessSchoolib });

	return {
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
	const { firstname, lastname, pages } = useLoaderResponse<LoaderData>();
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
						firstname && lastname
							? { firstname, lastname }
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
