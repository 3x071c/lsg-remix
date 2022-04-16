/* eslint-disable sort-keys */
import type { ImageProps } from "@chakra-ui/react";
import { Box, Image as ChakraImage } from "@chakra-ui/react";
import useNativeLazyLoading from "@charlietango/use-native-lazy-loading";
import { useInView } from "react-intersection-observer";
import { entries } from "~app/util";

const VARIANTS = {
	mini: 427,
	preview: 848,
	wxga: 1280,
	public: 1366,
	hd: 1920,
	wqhd: 2560,
	"4k": 3840,
} as const;
type Variant = keyof typeof VARIANTS;

const imagedelivery = () =>
	typeof document !== "undefined"
		? window.env.IMAGEDELIVERY
		: process.env["IMAGEDELIVERY"];

const src = (id: string, variant: Variant) =>
	`${String(imagedelivery())}/${id}/${variant}`;

export default function Image({
	priority,
	id,
	sizes,
	...props
}: Omit<ImageProps, "src" | "srcSet" | "loading" | "ignoreFallback"> & {
	priority?: boolean;
	id: string;
}): JSX.Element {
	const supportsLazyLoading = useNativeLazyLoading();
	const { ref, inView } = useInView({
		fallbackInView: true,
		initialInView: priority,
		rootMargin: "200px 0px",
		skip: supportsLazyLoading,
		triggerOnce: true,
		threshold: 1,
	});
	const { onLoad, onError, crossOrigin, alt, ...boxProps } = props;
	const load = inView || supportsLazyLoading || priority;

	return (
		<Box {...boxProps} ref={ref} pos="relative">
			<ChakraImage
				w="full"
				h="full"
				{...props}
				fallbackSrc="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%27848%27%20height=%27477%27/%3e"
				src={src(id, "preview")}
				filter="auto"
				blur={load ? undefined : "1px"}
			/>
			{load && (
				<ChakraImage
					pos="absolute"
					inset={0}
					w="full"
					h="full"
					ignoreFallback
					{...props}
					loading={priority ? "eager" : "lazy"}
					src={src(id, "public")}
					srcSet={entries(VARIANTS)
						.map(([k, v]) => `${src(id, k)} ${v}w`)
						.join(",\n")}
					sizes={sizes}
				/>
			)}
		</Box>
	);
}
