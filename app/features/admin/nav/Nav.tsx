import { LockIcon, QuestionIcon, SettingsIcon } from "@chakra-ui/icons";
import {
	Box,
	Flex,
	chakra,
	Spacer,
	Heading,
	HStack,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuDivider,
	MenuGroup,
	Button,
	Avatar,
	StackDivider,
	useToast,
} from "@chakra-ui/react";
import { useNavigate } from "remix";
import { maxContentWidth } from "~feat/chakra";
import { Link, NavLink } from "~feat/links";

export function CmsNav({
	page,
	pages,
	user,
}: {
	page: {
		url: string;
		short: string;
	};
	pages: {
		id: number;
		url: string;
		short: string;
	}[];
	user?: {
		uuid: string;
		firstname: string;
		lastname: string;
	};
}): JSX.Element {
	const navigate = useNavigate();
	const toast = useToast();

	return (
		<chakra.nav w="full" borderBottomWidth={1}>
			<Flex align="center" w="full" maxW={maxContentWidth} mx="auto">
				<NavLink href="." end>
					<Box p={2} px={4}>
						<Heading as="h2" size="md">
							{page.short}
						</Heading>
					</Box>
				</NavLink>
				<Spacer />
				<HStack
					divider={<StackDivider />}
					spacing={2}
					overflowY="auto"
					textAlign="center">
					{pages
						.filter(({ short }) => short !== page.short)
						.map(({ id, short, url }) => (
							<Box key={id}>
								<NavLink href={url} end>
									{short}
								</NavLink>
							</Box>
						))}
				</HStack>
				<Spacer />
				{user && (
					<Menu>
						<MenuButton
							as={Button}
							p={2}
							px={4}
							variant="link"
							rounded="full">
							<Avatar
								size="sm"
								name={`${user.firstname} ${user.lastname}`}
							/>
						</MenuButton>
						<MenuList>
							<MenuGroup
								title={`${user.firstname} ${user.lastname}`}>
								<Link href={`/admin/users/user/${user.uuid}`}>
									<MenuItem icon={<SettingsIcon />}>
										Einstellungen
									</MenuItem>
								</Link>
								<MenuItem
									icon={<QuestionIcon />}
									onClick={() =>
										toast({
											description: `Noch nicht implementiert`,
											duration: 3000,
											isClosable: false,
											status: "info",
											title: "Aktuell nicht möglich",
										})
									}>
									Hilfe
								</MenuItem>
							</MenuGroup>
							<MenuDivider />
							<MenuItem
								icon={<LockIcon />}
								onClick={() => navigate("/logout")}>
								Abmelden
							</MenuItem>
						</MenuList>
					</Menu>
				)}
			</Flex>
		</chakra.nav>
	);
}
