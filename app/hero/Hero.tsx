import {
	Heading,
	Wrap,
	WrapItem,
	Text,
	VStack,
	Box,
	Image,
} from "@chakra-ui/react";
import backgroundImage from "./bg.jpg";

export default function Hero() {
	return (
		<Wrap
			spacing={{ base: "xl", md: "3xl" }}
			justify="center"
			align="center"
			textAlign="center"
			px={{ base: "xl", md: "3xl" }}
			py={{ base: "xl", md: "3xl" }}>
			<WrapItem flex="1 1 0">
				<VStack spacing={{ base: "xl", md: "3xl" }}>
					<Heading as="h1" size="3xl">
						Louise-Schroeder-Gymnasium
					</Heading>
					<Text fontSize={{ base: "lg", md: "xl" }}>
						Naturwissenschaftlich-technologisches und sprachliches
						Gymnasium in München 🍺
					</Text>
				</VStack>
			</WrapItem>
			<WrapItem flex="1 1 0" minW="270px">
				<Box boxShadow="2xl" d="flex">
					<Image
						src={backgroundImage}
						alt="Louise-Schroeder-Gymnasium Außenansicht"
						borderRadius="2xl"
					/>
				</Box>
			</WrapItem>
		</Wrap>
	);
}
