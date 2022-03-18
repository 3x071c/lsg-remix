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
import { memo } from "react";
import { LinkButton } from "~app/links";

type NavbarProps = {
	data: {
		pages: {
			id: number;
			title: string;
		}[];
		id: number;
		name: string;
	}[];
};
export default memo(function Navbar({
	data: categories,
}: NavbarProps): JSX.Element {
	const theme = useTheme();
	const popoverContentBackdropBg = useColorModeValue(
		"whiteAlpha.900",
		transparentize("gray.700", 0.9)(theme),
	);

	return (
		<chakra.nav borderBottomWidth="1px" w="full" pos="sticky">
			<Flex w="full" maxW="7xl" mx="auto" align="center">
				<Box p={2}>
					<Heading size="lg">LSG</Heading>
				</Box>
				<Spacer />
				<HStack textAlign="center" spacing={2} overflowY="auto">
					{categories.map(({ name, id, pages }) => (
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
												bg: popoverContentBackdropBg,
											},
									}}>
									<PopoverBody>
										<VStack spacing={4}>
											{pages.map(
												({
													id: pageId,
													title: pageTitle,
												}) => (
													<LinkButton
														href={`/page/${pageId}`}
														key={`${id}.${pageId}`}
														variant="ghost"
														w="full">
														{pageTitle}
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
				{
					// TODO Add cms indicator here
				}
			</Flex>
		</chakra.nav>
	);
});
