import { chakra, ChakraProps } from "@chakra-ui/react";
import { isString } from "lodash";
import NextImage, { ImageProps } from "next/image";

export default chakra(function Image({
	width,
	w,
	height,
	h,
	...props
}: ImageProps & Pick<ChakraProps, "w" | "h">): JSX.Element {
	const [nextWidth, nextHeight] = [
		(isString(width) ? width.match(/\d+/)?.[0] : width) ??
			(w as string | undefined),
		(isString(height) ? height.match(/\d+/)?.[0] : height) ??
			(h as string | undefined),
	];
	return (
		<NextImage
			placeholder="blur"
			{...props}
			width={nextWidth}
			height={nextHeight}
		/>
	);
});
