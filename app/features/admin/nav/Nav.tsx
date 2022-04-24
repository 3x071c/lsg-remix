import type { LayoutProps, PositionProps } from "@chakra-ui/react";
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
	useToast,
	useTheme,
} from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import { useNavigate } from "remix";
import { maxContentWidth } from "~feat/chakra";
import { NavLink } from "~feat/links";

export default function CmsNav({
	page,
	pages,
	top,
	height,
	firstname,
	lastname,
}: {
	page: string;
	pages: {
		id: number;
		url: string;
		short: string;
	}[];
	top: PositionProps["top"];
	height: LayoutProps["height"];
	firstname: string;
	lastname: string;
}): JSX.Element {
	const navigate = useNavigate();
	const toast = useToast();
	const theme = useTheme();
	const bg = useColorModeValue("white", "gray.800");
	const bgTransparent = useColorModeValue(
		"whiteAlpha.900",
		transparentize("gray.800", 0.9)(theme),
	);

	return (
		<chakra.nav
			borderBottomWidth={1}
			w="full"
			pos="sticky"
			top={top}
			zIndex={1}
			bg={bg}
			sx={{
				"@supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none))":
					{
						backdropFilter: "auto",
						// eslint-disable-next-line sort-keys -- Blur has to come after `auto` filter for this to work!
						backdropBlur: "md",
						bg: bgTransparent,
					},
			}}>
			<Flex
				w="full"
				maxW={maxContentWidth}
				mx="auto"
				align="center"
				h={height}
				overflow="hidden">
				<NavLink href="." end>
					<Box p={2} px={4}>
						<Heading as="h2" size="md">
							{page}
						</Heading>
					</Box>
				</NavLink>
				<Spacer />
				<HStack
					textAlign="center"
					spacing={2}
					overflowY="auto"
					divider={<StackDivider />}>
					{pages
						.filter(({ short }) => short !== page)
						.map(({ id, short, url }) => (
							<Box key={id}>
								<NavLink href={url} variant="link" end>
									{short}
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
						<Avatar size="sm" name={`${firstname} ${lastname}`} />
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
}
