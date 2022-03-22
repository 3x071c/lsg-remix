import type { IconType } from "react-icons";
import { Center, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { Link } from "~app/links";

export default function NavElement({
	href,
	name,
	icon,
}: {
	href: string;
	name: string;
	icon: IconType;
}) {
	const bgHover = useColorModeValue("gray.300", "gray.800");

	return (
		<Link
			href={href}
			py={2}
			borderRadius="lg"
			_hover={{
				bg: bgHover,
			}}>
			<Flex alignItems="center" ml={2}>
				<Center mr={2}>
					<Icon boxSize={5} as={icon} />
				</Center>
				<Text fontSize={18} textDecoration="none" fontWeight={600}>
					{name}
				</Text>
			</Flex>
		</Link>
	);
}
