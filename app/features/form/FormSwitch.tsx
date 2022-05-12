import type { FormControlProps, SwitchProps } from "@chakra-ui/react";
import {
	Switch,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	forwardRef,
} from "@chakra-ui/react";
import { useField } from "remix-validated-form";

export const FormSwitch = forwardRef<
	SwitchProps &
		Pick<FormControlProps, "isDisabled"> & {
			name: string;
			label: string;
			helper: string;
			formId?: string;
		},
	"input"
>(function InnerFormSwitch(
	{ name, label, helper, isDisabled, formId, ...props },
	ref,
): JSX.Element {
	const { error, getInputProps } = useField(name, { formId });

	return (
		<FormControl isInvalid={!!error} isDisabled={isDisabled} my={2}>
			<FormLabel htmlFor={name}>{label}</FormLabel>
			<Switch {...props} {...getInputProps()} id={name} ref={ref} />
			{!error ? (
				<FormHelperText>{helper}</FormHelperText>
			) : (
				<FormErrorMessage>{error}</FormErrorMessage>
			)}
		</FormControl>
	);
});
