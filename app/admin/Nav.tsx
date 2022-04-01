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
} from "@chakra-ui/react";
import { memo } from "react";
import { NavLink } from "~app/links";
import { entries } from "~app/util";

const pages = {
	CMS: "/admin/cms",
	Home: "/admin",
	Lab: "/admin/lab",
};
export default memo(function CmsNav({
	active,
	username,
}: {
	active: keyof typeof pages;
	username: string;
}): JSX.Element {
	return (
		<chakra.nav borderBottomWidth="1px" w="full" pos="sticky">
			<Flex w="full" maxW="7xl" mx="auto" align="center">
				<Box p={2} px={4}>
					<Heading size="md">{active}</Heading>
				</Box>
				<Spacer />
				<HStack
					textAlign="center"
					spacing={2}
					overflowY="auto"
					divider={<StackDivider />}>
					{entries(pages)
						.filter(([name]) => name !== active)
						.map(([name, url]) => (
							<Box key={name}>
								<NavLink href={url} variant="link">
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
							src="https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200"
						/>
					</MenuButton>
					<MenuList>
						<MenuGroup title={username}>
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
