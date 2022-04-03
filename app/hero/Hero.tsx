import { Heading, Wrap, WrapItem, Text, Box } from "@chakra-ui/react";
import { memo } from "react";
import { Image } from "~app/image";

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
						ignoreFallback
						id="9b9917b3-0fce-4ca5-0718-ca3e22794500"
						alt="Louise-Schroeder-Gymnasium Außenansicht"
						borderRadius="2xl"
						sizes="(max-width: 600px) 100vw, 50vw"
					/>
				</Box>
			</WrapItem>
		</Wrap>
	);
});
