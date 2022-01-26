import { Heading, Wrap, WrapItem, Text, VStack } from "@chakra-ui/react";
import { Image } from "$app/image";
import { useBreakpoints, useHeadingSize, useSubHeadingSize } from "$app/layout";
import backgroundImage from "./bg.jpg";

export default function Hero() {
	const spacing = useBreakpoints((k, _v, i) => [k, `${(i + 1) ** 2}px`]);
	const headingSize = useHeadingSize();
	const subHeadingSize = useSubHeadingSize();

	return (
		<Wrap
			spacing={spacing}
			justify="center"
			align="center"
			textAlign="center"
			p={spacing}>
			<WrapItem flex="1 1 0">
				<VStack spacing={spacing}>
					<Heading as="h1" size={headingSize}>
						Louise-Schroeder-Gymnasium
					</Heading>
					<Text fontSize={subHeadingSize}>
						Naturwissenschaftlich-technologisches und sprachliches
						Gymnasium in München 🍺
					</Text>
				</VStack>
			</WrapItem>
			<WrapItem flex="1 1 0" minW="270px">
				<Image
					src={backgroundImage}
					alt="Louise-Schroeder-Gymnasium Außenansicht"
					priority
				/>
			</WrapItem>
		</Wrap>
	);
}
