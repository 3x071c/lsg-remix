import type { LayoutProps } from "@chakra-ui/react";
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
} from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import { maxContentWidth } from "~feat/chakra";
import { Link, LinkButton } from "~feat/links";

type NavbarProps = {
	groupedPages: {
		id: number;
		name: string;
		pages: {
			id: number;
			title: string;
		}[];
	}[];
	height: LayoutProps["h"];
};
export function Nav({ groupedPages, height }: NavbarProps): JSX.Element {
	const theme = useTheme();
	const popoverBgTransparent = useColorModeValue(
		"whiteAlpha.900",
		transparentize("gray.700", 0.9)(theme),
	);
	const bg = useColorModeValue("white", "gray.800");
	const bgTransparent = useColorModeValue(
		"whiteAlpha.900",
		transparentize("gray.800", 0.9)(theme),
	);

	return (
		<chakra.nav
			w="full"
			pos="sticky"
			top={0}
			zIndex={2}
			bg={bg}
			borderBottomWidth={1}
			sx={{
				"@supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none))":
					{
						/* According to the spec, backdrop-filters essentially can't be nested (only works on Safari), so we'll have to put those filters into pseudo elements for the other browsers */
						_before: {
							backdropFilter: "auto",
							// eslint-disable-next-line sort-keys -- Blur has to come after `auto` filter for this to work!
							backdropBlur: "md",
							bg: bgTransparent,
							content: '""',
							h: "full",
							pos: "absolute",
							w: "full",
							zIndex: -1,
						},
						bg: "transparent",
					},
			}}>
			<Flex
				w="full"
				h={height}
				maxW={maxContentWidth}
				mx="auto"
				align="center"
				overflow="hidden">
				<Link href="/">
					<Box p={2} px={4}>
						<Heading as="h1" size="lg">
							LSG
						</Heading>
					</Box>
				</Link>
				<Spacer />
				<HStack textAlign="center" spacing={2} overflowY="auto">
					{groupedPages.map(({ id, name, pages }) => (
						<Box key={id}>
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
												bg: popoverBgTransparent,
											},
									}}>
									<PopoverBody>
										<VStack spacing={4}>
											{pages.map(
												({ id: pageId, title }) => (
													<LinkButton
														href={`/page/${pageId}`}
														w="full"
														variant="ghost"
														key={pageId}>
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
}
