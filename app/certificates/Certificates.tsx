/* eslint-disable sort-keys -- Don't sort the certificates by ID, that's stupid */
import { Text, Wrap, WrapItem, useColorMode, useToken } from "@chakra-ui/react";
import { memo } from "react";
import { Image } from "~app/image";
import { entries } from "~app/util";

export default memo(function Awards({
	maxContentWidth,
}: {
	maxContentWidth: string;
}) {
	const [maxContentWidthValue] = useToken(
		"sizes",
		[maxContentWidth],
		["80rem"],
	) as [string];
	const [wrapperSpacing] = useToken("space", ["8"], ["2rem"]) as [string];
	const calcSpacing = `${wrapperSpacing} * 4`;
	const { colorMode } = useColorMode();
	const isDark = colorMode === "dark";

	return (
		<>
			<Text py={2} fontSize="lg" textAlign="center" color="gray.500">
				Referenzschule der TU München
			</Text>
			<Wrap w="full" spacing={8} align="center" justify="space-between">
				{entries({
					"6824d479-95f3-480a-c545-632085024c00":
						"'Schule ohne Rassismus, Schule mit Courage' Logo",
					"fe6600fa-e120-4011-aaf0-13c8df3d5800":
						"'DELF' Sprachzertifikat Logo (französisch)",
					"01467606-6ce7-4393-ca35-e695c2a1f500":
						"'CILS' Sprachzertifikat Logo (italienisch)",
					"599ceb84-e15b-44e0-5577-1ba92e680c00":
						"'Cambridge English Advanced' Sprachzertifikat Logo (englisch)",
				}).map(([id, alt]) => (
					<WrapItem
						key={id}
						flex="1 1 0"
						d="flex"
						alignItems="center"
						justifyContent="center"
						maxH={100}>
						<Image
							id={id}
							alt={alt}
							maxH="inherit"
							h="inherit"
							w="auto"
							sizes={`(max-width: ${maxContentWidthValue}) calc((100vw - (${calcSpacing})) / 4),
							calc((${maxContentWidthValue} - (${calcSpacing})) / 4)`}
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
