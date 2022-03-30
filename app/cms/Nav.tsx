import {
	VStack,
	Button,
	Heading,
	Icon,
	useColorModeValue,
	Spacer,
	Box,
	Text,
} from "@chakra-ui/react";
import { FiHome } from "react-icons/fi";
import { LinkButton } from "~app/links";
import { url as cmsUrl } from "~routes/admin/cms/index";

export default function CmsNavbar({ fullName }: { fullName: string }) {
	return (
		<VStack
			pos="sticky"
			bg={useColorModeValue("gray.200", "gray.700")}
			h="100vh"
			direction="column"
			alignItems="stretch"
			spacing={2}>
			<Box p={4} borderBottomWidth="2px">
				<Text fontSize="md">Willkommen zurück,</Text>
				<Heading size="xl">{fullName}</Heading>
			</Box>
			<Box p={4}>
				<LinkButton
					href={cmsUrl}
					variant="ghost"
					leftIcon={<Icon as={FiHome} />}
					w="full"
					size="lg">
					Home
				</LinkButton>
			</Box>
			<Spacer />
			<Box p={4}>
				<Button
					type="submit"
					variant="outline"
					colorScheme="red"
					w="full">
					Logout
				</Button>
			</Box>
		</VStack>
	);
}
