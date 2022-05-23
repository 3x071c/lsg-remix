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
					<Text mt={4} fontSize="xl">
						Naturwissenschaftlich-technologisches und sprachliches
						Gymnasium in München 🍺
					</Text>
					<Text
						mt={2}
						fontSize="lg"
						textAlign="center"
						color={grayColor}>
						Referenzschule der TU München
					</Text>
				</Box>
			</WrapItem>
			<WrapItem minW={270} flex="1 1 0">
				<Box d="flex" borderRadius="2xl" boxShadow="2xl">
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
