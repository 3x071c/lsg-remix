import type { FormControlProps, SelectProps } from "@chakra-ui/react";
import type { ReactNode } from "react";
import {
	HStack,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	Select,
	forwardRef,
} from "@chakra-ui/react";
import { useField } from "remix-validated-form";

export default forwardRef<
	SelectProps &
		Pick<FormControlProps, "isDisabled"> & {
			name: string;
			label: string;
			helper: string;
			formId?: string;
			rightChild?: ReactNode;
		},
	"select"
>(function FormSelect(
	{ name, label, helper, isDisabled, formId, rightChild, ...props },
	ref,
): JSX.Element {
	const { error, getInputProps } = useField(name, { formId });

	return (
		<FormControl
			isRequired
			isInvalid={!!error}
			isDisabled={isDisabled}
			my={2}>
			<FormLabel htmlFor={name} fontWeight="semibold">
				{label}
			</FormLabel>
			<HStack align="center" justify="space-between">
				<Select {...props} {...getInputProps()} id={name} ref={ref} />
				{rightChild}
			</HStack>
			{!error ? (
				<FormHelperText>{helper}</FormHelperText>
			) : (
				<FormErrorMessage>{error}</FormErrorMessage>
			)}
		</FormControl>
	);
});
