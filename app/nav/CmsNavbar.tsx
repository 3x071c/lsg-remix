import {
	Flex,
	Stack,
	Button,
	useColorModeValue,
	Heading,
} from "@chakra-ui/react";
import { FiHome } from "react-icons/fi";
import { Form } from "remix";
import { url as logoutURL } from "~routes/cms.logout";
import { url as cmsUrl } from "~routes/cms/index";
import NavElement from "./CmsNavElement";

export default function CmsNavbar({ fullName }: { fullName: string }) {
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
					<NavElement icon={FiHome} name="Home" href={cmsUrl} />
				</Stack>
				<Stack>
					<Flex
						mx={2}
						alignItems="center"
						justifyContent="space-between">
						<Form method="post" action={logoutURL}>
							<Button
								type="submit"
								variant="outline"
								colorScheme="red">
								Logout
							</Button>
						</Form>
					</Flex>
				</Stack>
			</Flex>
		</Flex>
	);
}
