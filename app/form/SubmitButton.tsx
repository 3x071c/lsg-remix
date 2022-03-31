import type { PropsWithChildren } from "react";
import { Button, ButtonProps } from "@chakra-ui/react";
import { useFormContext, useIsSubmitting } from "remix-validated-form";

export default function SubmitButton({
	isLoading,
	disabled,
	...props
}: PropsWithChildren<ButtonProps>): JSX.Element {
	const isSubmitting = useIsSubmitting();
	const { isValid } = useFormContext();
	const isDisabled = isSubmitting || !isValid || disabled;

	return (
		<Button
			{...props}
			type="submit"
			disabled={isDisabled}
			isLoading={isSubmitting || isLoading}
			mt={2}
		/>
	);
}
