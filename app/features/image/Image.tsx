import type { ImageProps } from "@chakra-ui/react";
import { Image as ChakraImage } from "@chakra-ui/react";

export function Image({
	priority,
	...props
}: Omit<
	MakeRequired<ImageProps, "src">,
	"srcSet" | "loading" | "ignoreFallback" | "sizes"
> & {
	priority?: boolean;
}): JSX.Element {
	return (
		<ChakraImage
			w="full"
			h="full"
			ignoreFallback
			{...props}
			loading={priority ? "eager" : "lazy"}
		/>
	);
}
