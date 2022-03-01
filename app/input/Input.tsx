import type { PropsWithChildren } from "react";
import {
	Input as ChakraInput,
	InputProps,
	useColorModeValue,
} from "@chakra-ui/react";

export default function Input(props: PropsWithChildren<InputProps>) {
	const focusBorderColor = useColorModeValue("brand.500", "brand.300");

	return <ChakraInput {...props} focusBorderColor={focusBorderColor} />;
}
