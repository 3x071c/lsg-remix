import { Heading, Wrap, WrapItem, Text, Box } from "@chakra-ui/react";
import { memo } from "react";
import { Image } from "~app/image";
import backgroundImage from "./bg.jpg";

export default memo(function Hero() {
	return (
		<Wrap
			spacing={8}
			justify="center"
			align="center"
			textAlign="center"
			py={8}>
			<WrapItem flex="1 1 0">
				<Box>
					<Heading as="h1" size="3xl" d="block">
						Louise-Schroeder-Gymnasium
					</Heading>
					<Text fontSize={{ base: "lg", md: "xl" }} mt={4}>
						Naturwissenschaftlich-technologisches und sprachliches
						Gymnasium in München 🍺
					</Text>
				</Box>
			</WrapItem>
			<WrapItem flex="1 1 0" minW="270px">
				<Box d="flex" boxShadow="2xl" borderRadius="2xl">
					<Image
						src={backgroundImage}
						alt="Louise-Schroeder-Gymnasium Außenansicht"
						borderRadius="2xl"
					/>
				</Box>
			</WrapItem>
		</Wrap>
	);
});
