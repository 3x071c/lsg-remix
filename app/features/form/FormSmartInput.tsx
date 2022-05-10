import type { FormControlProps } from "@chakra-ui/react";
import type { SmartInputProps } from "~feat/smartinput";
import {
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	forwardRef,
} from "@chakra-ui/react";
import { useField } from "remix-validated-form";
import { SmartInput } from "~feat/smartinput";

export const FormSmartInput = forwardRef<
	SmartInputProps &
		Pick<FormControlProps, "isDisabled"> & {
			name: string;
			label: string;
			helper: string;
			formId?: string;
		},
	"input"
>(function InnerFormSmartInput(
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
			<SmartInput {...props} {...getInputProps()} id={name} ref={ref} />
			{!error ? (
				<FormHelperText>{helper}</FormHelperText>
			) : (
				<FormErrorMessage>{error}</FormErrorMessage>
			)}
		</FormControl>
	);
});
