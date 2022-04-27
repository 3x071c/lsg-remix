import type { FormControlProps, InputProps } from "@chakra-ui/react";
import {
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	Input,
	forwardRef,
} from "@chakra-ui/react";
import { useField } from "remix-validated-form";

export const FormInput = forwardRef<
	InputProps &
		Pick<FormControlProps, "isDisabled"> & {
			name: string;
			label: string;
			helper: string;
			formId?: string;
		},
	"input"
>(function InnerFormInput(
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
			<Input {...props} {...getInputProps()} id={name} ref={ref} />
			{!error ? (
				<FormHelperText>{helper}</FormHelperText>
			) : (
				<FormErrorMessage>{error}</FormErrorMessage>
			)}
		</FormControl>
	);
});
