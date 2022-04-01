import { Image as ChakraImage, ImageProps } from "@chakra-ui/react";

export default function Image(props: ImageProps): JSX.Element {
	return (
		<ChakraImage fallbackSrc="https://via.placeholder.com/150" {...props} />
	);
}
