import { Button, Heading, Wrap, WrapItem, Text, Box } from "@chakra-ui/react";
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
			maxW="6xl">
			<WrapItem flex="1 1 0" textAlign="left">
				<Box maxWidth={400}>
					<Heading as="h1" size="2xl" d="block">
						Städtisches Louise-Schroeder-Gymnasium München
					</Heading>
					<Text fontSize="xl" mt={4}>
						Naturwissenschaftlich-technologisches und sprachliches
						Gymnasium in München.
					</Text>
					<Button background="rgb(0, 119, 255)" marginTop={3}>
						Aktuelle Termine
					</Button>
					<Text marginTop={6} fontSize="lg" color="grey">
						Referenzschule der TU München
					</Text>
				</Box>
			</WrapItem>
			<WrapItem flex="1 1 0" minW="570px">
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
