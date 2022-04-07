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
} from "@chakra-ui/react";
import { memo } from "react";
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
							<MenuItem icon={<SettingsIcon />}>
								Einstellungen
							</MenuItem>
							<MenuItem icon={<QuestionIcon />}>Hilfe</MenuItem>
						</MenuGroup>
						<MenuDivider />
						<MenuItem icon={<LockIcon />}>Abmelden</MenuItem>
					</MenuList>
				</Menu>
			</Flex>
		</chakra.nav>
	);
});
