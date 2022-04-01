import { Heading, Wrap, WrapItem, Text, Box } from "@chakra-ui/react";
import { memo } from "react";
import { Image } from "~app/image";
import backgroundImage from "./bg.jpg";

export default memo(function Hero() {
	return (
		<Wrap spacing={8} justify="center" align="center" textAlign="center">
			<WrapItem flex="1 1 0">
				<Box>
					<Heading as="h1" size="3xl" d="block">
						Louise-Schroeder-Gymnasium
					</Heading>
					<Text fontSize="xl" mt={4}>
						Naturwissenschaftlich-technologisches und sprachliches
						Gymnasium in München 🍺
					</Text>
				</Box>
			</WrapItem>
			<WrapItem flex="1 1 0" minW="270px">
				<Box d="flex" boxShadow="2xl" borderRadius="2xl">
					<Image
						fallbackSrc="https://via.placeholder.com/600x400"
						src={backgroundImage}
						alt="Louise-Schroeder-Gymnasium Außenansicht"
						borderRadius="2xl"
					/>
				</Box>
			</WrapItem>
		</Wrap>
	);
});
