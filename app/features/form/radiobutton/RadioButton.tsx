import type { RadioProps } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import { Box, useRadio, chakra } from "@chakra-ui/react";

export function RadioButton({
	children,
	...props
}: PropsWithChildren<RadioProps>) {
	const { getInputProps, getCheckboxProps } = useRadio(props);
	const input = getInputProps();
	const checkbox = getCheckboxProps();

	return (
		<chakra.label>
			<input {...input} />
			<Box {...checkbox}>{children}</Box>
		</chakra.label>
	);
}
