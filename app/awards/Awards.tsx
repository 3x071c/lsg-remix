import { Wrap, WrapItem } from "@chakra-ui/react";
import { memo } from "react";
import { Image } from "~app/image";
import awardCae from "./award-cae.png";
import awardCils from "./award-cils.png";
import awardCourage from "./award-courage.jpg";
import awardDelf from "./award-delf.jpg";

export default memo(function Awards() {
	return (
		<Wrap
			spacing={8}
			justify="space-between"
			w="full"
			mt="5"
			maxW="5xl"
			pos="relative"
			_before={{
				bg: "linear-gradient(90deg, rgba(66, 71, 112, 0.09), rgba(66, 71, 112, 0.09) 50%, transparent 0, transparent)",
				bgSize: "8px 1px",
				content: "''",
				h: "1px",
				left: "0",
				pos: "absolute",
				top: "-20px",
				w: "full",
			}}>
			<WrapItem h="70px">
				<Image
					src={awardCourage}
					h="inherit"
					filter="grayscale(1)"
					mixBlendMode="multiply"
				/>
			</WrapItem>
			<WrapItem h="70px">
				<Image
					src={awardDelf}
					h="inherit"
					filter="grayscale(1)"
					mixBlendMode="multiply"
				/>
			</WrapItem>
			<WrapItem h="70px">
				<Image
					src={awardCils}
					h="inherit"
					filter="grayscale(1)"
					mixBlendMode="multiply"
				/>
			</WrapItem>
			<WrapItem h="70px">
				<Image
					src={awardCae}
					h="inherit"
					filter="grayscale(1)"
					mixBlendMode="multiply"
				/>
			</WrapItem>
		</Wrap>
	);
});
