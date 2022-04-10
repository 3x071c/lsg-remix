import { Text, Wrap, WrapItem } from "@chakra-ui/react";
import { memo } from "react";
import { Image } from "~app/image";

export default memo(function Awards() {
	return (
		<>
			<Text py={2} fontSize="lg" textAlign="center" color="gray.500">
				Referenzschule der TU München
			</Text>
			<Wrap w="full" spacing={8} align="center" justify="space-between">
				{[
					"09676ff7-b3ca-44b2-d620-e1760fee4600",
					"79f5ddc2-fac9-462a-695e-492527c36b00",
					"03a4784b-2c97-4851-613d-bd7739a53b00",
					"a3a022b7-6506-47b9-4922-b6cb46213f00",
				].map((id) => (
					<WrapItem
						key={id}
						flex="1 1 0"
						d="flex"
						alignItems="center"
						justifyContent="center"
						maxH={100}>
						<Image
							id={id}
							maxH="inherit"
							h="inherit"
							w="auto"
							filter="grayscale(1)"
							mixBlendMode="multiply"
						/>
					</WrapItem>
				))}
			</Wrap>
		</>
	);
});
