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
	useColorModeValue,
	LayoutProps,
	PositionProps,
	useToast,
} from "@chakra-ui/react";
import { memo } from "react";
import { useNavigate } from "remix";
import { NavLink } from "~app/links";
import { entries } from "~app/util";

export default memo(function CmsNav({
	avatar,
	page,
	pages,
	top,
	height,
	firstname,
	lastname,
}: {
	avatar: string | undefined;
	page: string;
	pages: {
		[key: string]: string;
	};
	top: PositionProps["top"];
	height: LayoutProps["height"];
	firstname: string;
	lastname: string;
}): JSX.Element {
	const bg = useColorModeValue("white", "gray.800");
	const navigate = useNavigate();
	const toast = useToast();

	return (
		<chakra.nav
			borderBottomWidth="1px"
			w="full"
			pos="sticky"
			top={top}
			zIndex={3}
			bg={bg}>
			<Flex
				w="full"
				maxW="7xl"
				mx="auto"
				align="center"
				h={height}
				overflow="hidden">
				<NavLink href="." end>
					<Box p={2} px={4}>
						<Heading size="md">{page}</Heading>
					</Box>
				</NavLink>
				<Spacer />
				<HStack
					textAlign="center"
					spacing={2}
					overflowY="auto"
					divider={<StackDivider />}>
					{entries(pages)
						.filter(([name]) => name !== page)
						.map(([name, url]) => (
							<Box key={name}>
								<NavLink href={url} variant="link" end>
									{name}
								</NavLink>
							</Box>
						))}
				</HStack>
				<Spacer />
				<Menu>
					<MenuButton
						as={Button}
						p={2}
						px={4}
						rounded="full"
						variant="link">
						<Avatar
							size="sm"
							name={`${firstname} ${lastname}`}
							src={avatar}
						/>
					</MenuButton>
					<MenuList>
						<MenuGroup title={`${firstname} ${lastname}`}>
							<MenuItem
								icon={<SettingsIcon />}
								onClick={() =>
									toast({
										description: `Noch nicht implementiert`,
										duration: 3000,
										isClosable: false,
										status: "info",
										title: "Aktuell nicht möglich",
									})
								}>
								Einstellungen
							</MenuItem>
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
			</Flex>
		</chakra.nav>
	);
});
