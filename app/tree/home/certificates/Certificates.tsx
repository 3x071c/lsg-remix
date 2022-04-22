/* eslint-disable sort-keys -- Don't sort the certificates by ID, that's stupid */
import { Text, Wrap, WrapItem, useColorMode } from "@chakra-ui/react";
import { memo } from "react";
import { cae, cils, courage, delf } from "~assets";
import { Image } from "~feat/image";
import { entries } from "~lib/util";

export default memo(function Awards() {
	const { colorMode } = useColorMode();
	const isDark = colorMode === "dark";

	return (
		<>
			<Text py={2} fontSize="lg" textAlign="center" color="gray.500">
				Referenzschule der TU München
			</Text>
			<Wrap w="full" spacing={8} align="center" justify="space-between">
				{entries({
					[courage]:
						"'Schule ohne Rassismus, Schule mit Courage' Logo",
					[delf]: "'DELF' Sprachzertifikat Logo (französisch)",
					[cils]: "'CILS' Sprachzertifikat Logo (italienisch)",
					[cae]: "'Cambridge English Advanced' Sprachzertifikat Logo (englisch)",
				}).map(([src, alt]) => (
					<WrapItem
						key={src}
						flex="1 1 0"
						d="flex"
						alignItems="center"
						justifyContent="center"
						maxH={100}>
						<Image
							src={src}
							alt={alt}
							maxH="inherit"
							h="inherit"
							w="auto"
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
		</>
	);
});
