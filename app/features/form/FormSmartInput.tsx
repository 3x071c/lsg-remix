import type { SmartInputProps } from "./smartinput";
import type { FormControlProps } from "@chakra-ui/react";
import {
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	forwardRef,
} from "@chakra-ui/react";
import { useField } from "remix-validated-form";
import { SmartInput } from "./smartinput";

export const FormSmartInput = forwardRef<
	SmartInputProps &
		Pick<FormControlProps, "isDisabled"> & {
			clean?: boolean;
			name: string;
			label: string;
			helper: string;
			formId?: string;
		},
	"input"
>(function InnerFormSmartInput(
	{ clean, name, label, helper, isDisabled, formId, ...props },
	ref,
): JSX.Element {
	const { error, getInputProps } = useField(name, { formId });

	return (
		<FormControl
			isRequired
			isInvalid={!!error}
			isDisabled={isDisabled}
			my={2}>
			<FormLabel
				d={clean ? "none" : undefined}
				htmlFor={name}
				fontWeight="semibold">
				{label}
			</FormLabel>
			<SmartInput {...props} {...getInputProps()} id={name} ref={ref} />
			{!error ? (
				<FormHelperText>{clean ? "\u00A0" : helper}</FormHelperText>
			) : (
				<FormErrorMessage>{error}</FormErrorMessage>
			)}
		</FormControl>
	);
});
