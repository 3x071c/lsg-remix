import type { FormControlProps, InputProps } from "@chakra-ui/react";
import {
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	Input,
} from "@chakra-ui/react";
import { useField } from "remix-validated-form";

export default function FormInput({
	name,
	label,
	helper,
	isDisabled,
	...props
}: InputProps & { name: string; label: string; helper: string } & Pick<
		FormControlProps,
		"isDisabled"
	>): JSX.Element {
	const { error, getInputProps } = useField(name);

	return (
		<FormControl
			isRequired
			isInvalid={!!error}
			isDisabled={isDisabled}
			my={2}>
			<FormLabel htmlFor={name} fontWeight="semibold">
				{label}
			</FormLabel>
			<Input {...props} {...getInputProps()} id={name} />
			{!error ? (
				<FormHelperText>{helper}</FormHelperText>
			) : (
				<FormErrorMessage>{error}</FormErrorMessage>
			)}
		</FormControl>
	);
}
