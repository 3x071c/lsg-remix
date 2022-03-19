import {
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	InputProps,
} from "@chakra-ui/react";
import { useField } from "remix-validated-form";

export default function FormInput({
	name,
	label,
	...props
}: InputProps & { name: string; label: string }) {
	const { error, getInputProps } = useField(name);

	return (
		<FormControl isInvalid={!!error}>
			<FormLabel fontWeight="semibold" htmlFor={name}>
				{label}
			</FormLabel>
			<Input {...props} {...getInputProps()} id={name} />
			<FormErrorMessage fontWeight="semibold">{error}</FormErrorMessage>
		</FormControl>
	);
}
