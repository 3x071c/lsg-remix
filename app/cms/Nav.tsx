import {
	Stack,
	Button,
	Heading,
	Center,
	Flex,
	Icon,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import { FiHome } from "react-icons/fi";
import { Link } from "~app/links";
import { url as cmsUrl } from "~routes/admin/cms/index";

export default function CmsNavbar({ fullName }: { fullName: string }) {
	const bgHover = useColorModeValue("gray.300", "gray.800");

	return (
		<Flex
			bg={useColorModeValue("gray.200", "gray.700")}
			w="13%"
			minW="min-content"
			direction="column">
			<Flex
				borderBottom="2px"
				borderColor={useColorModeValue("gray.300", "gray.600")}
				w="100%"
				pl={4}
				alignItems="center">
				<Heading my={6} size="md">
					{fullName}
				</Heading>
			</Flex>
			<Flex
				flexGrow={1}
				py={4}
				px={2}
				direction="column"
				justifyContent="space-between">
				<Stack direction="column">
					<Link
						href={cmsUrl}
						py={2}
						borderRadius="lg"
						_hover={{
							bg: bgHover,
						}}>
						<Flex alignItems="center" ml={2}>
							<Center mr={2}>
								<Icon boxSize={5} as={FiHome} />
							</Center>
							<Text
								fontSize={18}
								textDecoration="none"
								fontWeight={600}>
								Home
							</Text>
						</Flex>
					</Link>
				</Stack>
				<Button
					mx={2}
					type="submit"
					variant="outline"
					colorScheme="red">
					Logout
				</Button>
			</Flex>
		</Flex>
	);
}
