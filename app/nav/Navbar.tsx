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
} from "@chakra-ui/react";
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
	return (
		<chakra.nav borderBottomWidth="1px" w="full" position="sticky">
			<Flex w="full" maxWidth="7xl" mx="auto">
				<Box p={2}>
					<Heading size="lg">LSG</Heading>
				</Box>
				<Spacer />
				<HStack textAlign="center" spacing={4}>
					{categories.map(({ name, id, pages }) => (
						<Popover key={id} trigger="hover">
							<PopoverTrigger>
								<Button
									variant="ghost"
									rightIcon={<ChevronDownIcon />}>
									{name}
								</Button>
							</PopoverTrigger>
							<PopoverContent shadow="xl" p={2}>
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
