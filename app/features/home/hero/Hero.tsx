import {
	Heading,
	Wrap,
	WrapItem,
	Text,
	Box,
	useColorModeValue,
} from "@chakra-ui/react";
import { bg } from "~assets";
import { Image } from "~feat/image";

export function Hero() {
	const grayColor = useColorModeValue("gray.600", "gray.400");

	return (
		<Wrap spacing={8} align="center" justify="center" textAlign="center">
			<WrapItem flex="1 1 0">
				<Box>
					<Heading as="h1" size="2xl" d="block">
						Städt. Louise-Schroeder-Gymnasium
					</Heading>
					<Text fontSize="xl" mt={4}>
						Naturwissenschaftlich-technologisches und sprachliches
						Gymnasium in München 🍺
					</Text>
					<Text
						pt={2}
						fontSize="lg"
						textAlign="center"
						color={grayColor}>
						Referenzschule der TU München
					</Text>
				</Box>
			</WrapItem>
			<WrapItem flex="1 1 0" minW={270}>
				<Box d="flex" boxShadow="2xl" borderRadius="2xl">
					<Image
						src={bg}
						alt="Louise-Schroeder-Gymnasium Außenansicht"
						borderRadius="2xl"
						priority
					/>
				</Box>
			</WrapItem>
		</Wrap>
	);
}
