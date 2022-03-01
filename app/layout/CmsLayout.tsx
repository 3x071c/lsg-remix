import type { IronSessionUser } from "$types/auth";
import type { User } from "@prisma/client";
import type { PropsWithChildren, ReactElement } from "react";
import type { IconType } from "react-icons/lib";
import { gql, useMutation, useQuery } from "@apollo/client";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Center,
	Flex,
	Heading,
	Icon,
	Skeleton,
	Stack,
	Text,
	useColorMode,
	useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiHome, FiFileText, FiUsers, FiImage } from "react-icons/fi";
import { Link } from "$app/links";

interface NavElementProps {
	href: string;
	name: string;
	selected: boolean;
	icon: IconType;
}

function NavElement({ href, name, selected, icon }: NavElementProps) {
	const defaultColor = useColorModeValue("gray.700", "gray.400");

	const color = selected ? "white" : defaultColor;
	const background = selected ? "brand.500" : "transparent";

	return (
		<Link
			href={href}
			py={2}
			borderRadius="lg"
			bg={background}
			_hover={{
				bg: useColorModeValue("gray.400", "gray.800"),
			}}>
			<Flex alignItems="center" ml={3}>
				<Center mr={2}>
					<Icon color={color} boxSize={5} as={icon} />
				</Center>
				<Text
					fontSize={18}
					textDecoration="none"
					fontWeight={600}
					color={color}>
					{name}
				</Text>
			</Flex>
		</Link>
	);
}

type CurrentPage = "pages" | "users" | "home" | "files";

interface Props {
	currentPage: CurrentPage;
}

const LOGOUT = gql`
	mutation Logout {
		logout {
			id
		}
	}
`;

const CURRENT_USER = gql`
	query User {
		currentUser {
			firstname
			lastname
		}
	}
`;

interface CurrentUser {
	currentUser: Pick<User, "firstname" | "lastname">;
}

function CmsLayout({ children, currentPage }: PropsWithChildren<Props>) {
	const [logout, { loading: logoutLoading, data: logoutData }] =
		useMutation<{ user: IronSessionUser }>(LOGOUT);
	const { loading: userLoading, data: userData } =
		useQuery<CurrentUser>(CURRENT_USER);

	const router = useRouter();

	const { colorMode, toggleColorMode } = useColorMode();

	if (logoutData) {
		if (typeof window !== "undefined") {
			void router.push("/login");
		}
	}

	return (
		<Flex w="100vw" h="100vh">
			<Flex h="100%" w="13%" minW={32} direction="column">
				<Flex w="100%" bg="brand.500" h={20} pl={5} alignItems="center">
					<Skeleton isLoaded={!userLoading}>
						{userData && (
							<Heading color="white" fontSize={20}>
								{`${userData.currentUser.firstname} `}
								{userData.currentUser.lastname}
							</Heading>
						)}
					</Skeleton>
				</Flex>
				<Flex
					flexGrow={1}
					bg={useColorModeValue("gray.300", "gray.700")}
					py={5}
					px={2}
					direction="column"
					justifyContent="space-between">
					<Stack direction="column">
						<NavElement
							icon={FiHome}
							name="Home"
							href="/cms"
							selected={currentPage === "home"}
						/>
						<NavElement
							icon={FiFileText}
							name="Pages"
							href="/cms/pages"
							selected={currentPage === "pages"}
						/>
						<NavElement
							icon={FiUsers}
							name="Users"
							href="/cms/users"
							selected={currentPage === "users"}
						/>
						<NavElement
							icon={FiImage}
							name="Files"
							href="/cms/files"
							selected={currentPage === "files"}
						/>
					</Stack>
					<Stack>
						<Flex
							mx={2}
							alignItems="center"
							justifyContent="space-between">
							<Button
								w={10}
								h={10}
								onClick={toggleColorMode}
								variant="outline">
								{colorMode === "dark" ? (
									<SunIcon />
								) : (
									<MoonIcon />
								)}
							</Button>
							<Button
								onClick={() => {
									void logout({});
								}}
								isLoading={logoutLoading}
								variant="outline"
								colorScheme="red">
								Logout
							</Button>
						</Flex>
					</Stack>
				</Flex>
			</Flex>
			<Box flexGrow={1}>{children}</Box>
		</Flex>
	);
}

CmsLayout.getLayout = (currentPage: CurrentPage) => {
	return function CmsLayoutWrapper(page: ReactElement) {
		return <CmsLayout currentPage={currentPage}>{page}</CmsLayout>;
	};
};

export default CmsLayout;
