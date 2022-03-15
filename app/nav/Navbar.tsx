import { Box, Flex, chakra, Spacer, Heading } from "@chakra-ui/react";
import { memo } from "react";
import { Link } from "~app/links";

type NavbarProps = {
	pages: {
		title: string;
		id: number;
	}[];
};
export default memo(function Navbar({ pages }: NavbarProps): JSX.Element {
	return (
		<chakra.nav borderBottomWidth="1px" w="full" position="sticky">
			<Flex w="full" maxWidth="7xl" mx="auto">
				<Box p={2}>
					<Heading size="md">LSG</Heading>
				</Box>
				<Spacer />
				<Flex justify="space-evenly" textAlign="center" align="center">
					{pages.map(({ title, id }) => (
						<Link href="/" mx={2} key={id}>
							{title}
						</Link>
					))}
				</Flex>
				<Spacer />
				{
					// TODO Add cms indicator here
				}
			</Flex>
		</chakra.nav>
	);
});
