import type { ButtonProps } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import { Button, forwardRef } from "@chakra-ui/react";
import { useFormContext, useIsSubmitting } from "remix-validated-form";

export const SubmitButton = forwardRef<
	PropsWithChildren<ButtonProps> & {
		formId?: string;
	},
	"button"
>(function InnerSubmitButton(
	{ isLoading, disabled, formId, ...props },
	ref,
): JSX.Element {
	const isSubmitting = useIsSubmitting(formId);
	const { isValid } = useFormContext(formId);
	const isDisabled = isSubmitting || !isValid || disabled;

	return (
		<Button
			{...props}
			type="submit"
			disabled={isDisabled}
			isLoading={isSubmitting || isLoading}
			mt={2}
			ref={ref}
		/>
	);
});
