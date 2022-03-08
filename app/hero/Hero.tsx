import {
	Heading,
	Wrap,
	WrapItem,
	Text,
	VStack,
	Box,
	Image,
	useBreakpointValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useBreakpoints } from "~app/layout";
import backgroundImage from "./bg.jpg";

export default function Hero() {
	const spacing = useBreakpoints((k, _v, i) => [k, `${(i + 1) ** 2}px`]);
	const headingSize = useBreakpointValue({ base: "2xl", md: "3xl" });
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<Wrap
			spacing={spacing}
			justify="center"
			align="center"
			textAlign="center"
			p={spacing}>
			<WrapItem flex="1 1 0">
				<VStack spacing={spacing}>
					<Heading as="h1" size={mounted ? headingSize : undefined}>
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
