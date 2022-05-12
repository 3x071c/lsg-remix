import type { FormControlProps, NumberInputProps } from "@chakra-ui/react";
import {
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	forwardRef,
} from "@chakra-ui/react";
import { useField } from "remix-validated-form";

export const FormNumberInput = forwardRef<
	NumberInputProps &
		Pick<FormControlProps, "isDisabled"> & {
			name: string;
			label: string;
			helper: string;
			formId?: string;
		},
	"input"
>(function InnerFormNumberInput(
	{ name, label, helper, isDisabled, formId, ...props },
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
			<NumberInput {...props} w="full">
				<NumberInputField {...getInputProps()} id={name} ref={ref} />
				<NumberInputStepper>
					<NumberIncrementStepper />
					<NumberDecrementStepper />
				</NumberInputStepper>
			</NumberInput>
			{!error ? (
				<FormHelperText>{helper}</FormHelperText>
			) : (
				<FormErrorMessage>{error}</FormErrorMessage>
			)}
		</FormControl>
	);
});
