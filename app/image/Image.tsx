/* eslint-disable sort-keys */
import { Box, Image as ChakraImage, ImageProps } from "@chakra-ui/react";
import useNativeLazyLoading from "@charlietango/use-native-lazy-loading";
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
	avatar,
	...props
}: Omit<ImageProps, "src" | "srcSet" | "loading" | "ignoreFallback"> & {
	priority?: boolean;
	id: string;
	avatar?: boolean;
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
	const maxData = sizes
		? sizes
				.replaceAll(/\(.*\)/g, "")
				.replaceAll(/\s/g, "")
				.replaceAll("px", "")
				.split(",")
				.map((v) => Number(v))
		: [];
	const max = maxData.length > 0 ? Math.max(...maxData) : undefined;
	const { onLoad, onError, crossOrigin, alt, ...boxProps } = props;

	return (
		<Box {...boxProps} ref={ref} pos="relative">
			<ChakraImage
				{...props}
				loading={priority ? "eager" : "lazy"}
				fallbackSrc={
					avatar
						? "data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%27256%27%20height=%27256%27/%3e"
						: "data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%271920%27%20height=%271280%27/%3e"
				}
				src={src(id, avatar ? "16" : "preview")}
				filter="auto"
				blur="1px"
			/>
			{inView ||
				supportsLazyLoading ||
				(priority && (
					<ChakraImage
						{...props}
						ignoreFallback
						pos="absolute"
						inset={0}
						transform="auto"
						scale={1.01}
						loading={priority ? "eager" : "lazy"}
						srcSet={entries(VARIANTS)
							.map(([k, v]) => {
								if (v > (max ?? NaN)) return false;
								return `${src(id, k)} ${v}w`;
							})
							.filter(Boolean)
							.join(",\n")}
						src={src(id, "public")}
					/>
				))}
			<noscript>
				<ChakraImage
					{...props}
					ignoreFallback
					w="full"
					h="full"
					loading={priority ? "eager" : "lazy"}
					srcSet={entries(VARIANTS)
						.map(([k, v]) => {
							if (v > (max ?? NaN)) return false;
							return `${src(id, k)} ${v}w`;
						})
						.filter(Boolean)
						.join(",\n")}
					src={src(id, "public")}
				/>
			</noscript>
		</Box>
	);
}
