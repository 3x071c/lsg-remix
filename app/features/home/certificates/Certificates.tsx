/* eslint-disable sort-keys -- Don't sort the certificates by ID, that's stupid */
import { Wrap, WrapItem, useColorMode } from "@chakra-ui/react";
import { cae, cils, courage, delf } from "~assets";
import { Image } from "~feat/image";
import { entries } from "~lib/util";

export function Certificates() {
	const { colorMode } = useColorMode();
	const isDark = colorMode === "dark";

	return (
		<Wrap spacing={8} align="center" justify="space-between" w="full">
			{entries({
				[courage]: "'Schule ohne Rassismus, Schule mit Courage' Logo",
				[delf]: "'DELF' Sprachzertifikat Logo (französisch)",
				[cils]: "'CILS' Sprachzertifikat Logo (italienisch)",
				[cae]: "'Cambridge English Advanced' Sprachzertifikat Logo (englisch)",
			}).map(([src, alt]) => (
				<WrapItem
					key={src}
					maxH={100}
					d="flex"
					flex="1 1 0"
					alignItems="center"
					justifyContent="center">
					<Image
						src={src}
						alt={alt}
						w="auto"
						h="inherit"
						maxH="inherit"
						filter="auto"
						invert={isDark ? "1" : undefined}
						sx={{
							"--chakra-grayscale":
								"grayscale(1)" /* WTF chakra? */,
						}}
					/>
				</WrapItem>
			))}
		</Wrap>
	);
}
