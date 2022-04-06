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
import { entries, fromEntries } from "~app/util";

const pages = {
	CMS: "/admin/cms",
	Home: "/admin",
	Lab: "/admin/lab",
};
export default memo(function CmsNav({
	top,
	height,
	firstname,
	lastname,
	avatar,
}: {
	top: PositionProps["top"];
	height: LayoutProps["height"];
	firstname: string;
	lastname: string;
	avatar: string | undefined;
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
				{entries(pages).map(([name, url]) => (
					<NavLink
						data-name={name}
						href={url}
						sx={{
							":not(.active)": {
								display: "none",
							},
						}}
						end>
						<Box p={2} px={4}>
							<Heading size="md">{name}</Heading>
						</Box>
					</NavLink>
				))}
				<Spacer />
				<HStack
					textAlign="center"
					spacing={2}
					overflowY="auto"
					divider={
						<StackDivider
							sx={fromEntries(
								entries(pages).map(([name, url]) => [
									"{} .active + &",
									{ display: "none" },
								]),
							)}
						/>
					}>
					{entries(pages).map(([name, url]) => (
						<Box key={name}>
							<NavLink
								href={url}
								variant="link"
								sx={{
									":not(:not(.active))": {
										display: "none",
									},
								}}
								end>
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
