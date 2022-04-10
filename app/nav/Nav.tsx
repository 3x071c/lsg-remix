import { ChevronDownIcon } from "@chakra-ui/icons";
import {
	Box,
	Flex,
	chakra,
	Spacer,
	Heading,
	Button,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverBody,
	HStack,
	VStack,
	useColorModeValue,
	useTheme,
	LayoutProps,
} from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import { memo } from "react";
import { Link, LinkButton } from "~app/links";
import { entries } from "~app/util";

type NavbarProps = {
	groupedPages: {
		[groupUUID: string]: {
			name: string;
			pages: {
				[pageUUID: string]: {
					title: string;
				};
			};
		};
	};
	height: LayoutProps["h"];
};
export default memo(function Nav({
	groupedPages,
	height,
}: NavbarProps): JSX.Element {
	const theme = useTheme();
	const popoverBg = useColorModeValue(
		"whiteAlpha.900",
		transparentize("gray.700", 0.9)(theme),
	);
	const bg = useColorModeValue("white", "gray.800");

	return (
		<chakra.nav
			borderBottomWidth="1px"
			w="full"
			pos="sticky"
			top={0}
			zIndex={2}
			bg={bg}>
			<Flex
				w="full"
				maxW="7xl"
				mx="auto"
				align="center"
				h={height}
				overflow="hidden">
				<Link href="/">
					<Box p={2} px={4}>
						<Heading size="lg">LSG</Heading>
					</Box>
				</Link>
				<Spacer />
				<HStack textAlign="center" spacing={2} overflowY="auto">
					{entries(groupedPages).map(([uuid, { name, pages }]) => (
						<Box key={uuid}>
							<Popover trigger="hover">
								<PopoverTrigger>
									<Button
										variant="ghost"
										rightIcon={<ChevronDownIcon />}>
										{name}
									</Button>
								</PopoverTrigger>
								<PopoverContent
									shadow="md"
									w="" // fixes oversized popover
									sx={{
										"@supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none))":
											{
												backdropFilter: "auto",
												// eslint-disable-next-line sort-keys -- Blur has to come after `auto` filter for this to work!
												backdropBlur: "md",
												bg: popoverBg,
											},
									}}>
									<PopoverBody>
										<VStack spacing={4}>
											{entries(pages).map(
												([pageUUID, { title }]) => (
													<LinkButton
														href={`/page/${pageUUID}`}
														key={`${uuid}.${pageUUID}`}
														variant="ghost"
														w="full">
														{title}
													</LinkButton>
												),
											)}
										</VStack>
									</PopoverBody>
								</PopoverContent>
							</Popover>
						</Box>
					))}
				</HStack>
				<Spacer />
			</Flex>
		</chakra.nav>
	);
});
