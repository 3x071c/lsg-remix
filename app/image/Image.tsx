/* eslint-disable sort-keys */
import {
	Box,
	Image as ChakraImage,
	ImageProps,
	useColorModeValue,
} from "@chakra-ui/react";
import useNativeLazyLoading from "@charlietango/use-native-lazy-loading";
// import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { entries } from "~app/util";

const VARIANTS = {
	"16": 16,
	"32": 32,
	"64": 64,
	"128": 128,
	"256": 256,
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
		: global.env["IMAGEDELIVERY"];

const src = (id: string, variant: Variant) =>
	`${String(imagedelivery())}/${id}/${variant}`;

export default function Image({
	priority,
	id,
	sizes,
	...props
}: Omit<ImageProps, "src"> & { priority?: boolean; id: string }): JSX.Element {
	const bg = useColorModeValue("gray.50", "gray.700");
	// const [isVisible, setIsVisible] = useState(false);
	const supportsLazyLoading = useNativeLazyLoading();
	const { ref, inView } = useInView({
		fallbackInView: true,
		initialInView: priority,
		rootMargin: "200px 0px",
		skip: supportsLazyLoading,
		triggerOnce: true,
		threshold: 1,
	});
	const maxData = sizes
		? sizes
				.replaceAll(/\(.*\)/g, "")
				.replaceAll(/\s/g, "")
				.replaceAll("px", "")
				.split(",")
				.map((v) => Number(v))
		: [];
	const max = maxData.length > 0 ? Math.max(...maxData) : undefined;

	// useEffect(() => {
	// 	setTimeout(() => {
	// 		setIsVisible(true);
	// 	}, 5000);
	// });

	return (
		<Box pos="relative" w="full" bg={bg} ref={ref}>
			{/* {isVisible && (
				<ChakraImage
					{...props}
					loading={priority ? "eager" : "lazy"}
					w="full"
					srcSet={entries(VARIANTS)
						.map(([k, v]) => {
							if (v > (max ?? NaN)) return false;
							return `${src(id, k)} ${v}w`;
						})
						.filter(Boolean)
						.join(",\n")}
					src="https://via.placeholder.com/600x400"
				/>
			)} */}
			{inView || supportsLazyLoading ? (
				<ChakraImage
					{...props}
					loading={priority ? "eager" : "lazy"}
					w="full"
					srcSet={entries(VARIANTS)
						.map(([k, v]) => {
							if (v > (max ?? NaN)) return false;
							return `${src(id, k)} ${v}w`;
						})
						.filter(Boolean)
						.join(",\n")}
					src={src(id, "public")}
				/>
			) : (
				<ChakraImage
					{...props}
					loading={priority ? "eager" : "lazy"}
					w="full"
					src={src(id, "preview")}
					filter="auto"
					blur="1px"
				/>
			)}
		</Box>
	);
}
