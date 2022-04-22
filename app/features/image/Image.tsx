/* eslint-disable sort-keys */
import type { ImageProps } from "@chakra-ui/react";
import { Box, Image as ChakraImage } from "@chakra-ui/react";
import { useInView } from "react-intersection-observer";

export default function Image({
	priority,
	...props
}: Omit<
	MakeRequired<ImageProps, "src">,
	"srcSet" | "loading" | "ignoreFallback" | "sizes"
> & {
	priority?: boolean;
}): JSX.Element {
	const { ref, inView } = useInView({
		fallbackInView: true,
		initialInView: priority,
		triggerOnce: true,
		threshold: 1,
	});

	return (
		<ChakraImage
			w="full"
			h="full"
			fallback={<Box d="block" w="848" h="477" />}
			{...props}
			loading={priority ? "eager" : "lazy"}
			filter="auto"
			blur={inView || priority ? undefined : "1px"}
			ref={ref}
		/>
	);
}
