import type {
	LayoutProps,
	ComponentWithAs,
	EditablePreviewProps,
	InputProps,
} from "@chakra-ui/react";
import type { ComponentProps } from "react";
import {
	EditablePreview,
	Input,
	Editable,
	Tooltip,
	EditableInput,
	forwardRef,
	useColorModeValue,
} from "@chakra-ui/react";

export type SmartInputProps = ComponentProps<
	ComponentWithAs<"span", EditablePreviewProps>
> &
	ComponentProps<ComponentWithAs<"input", InputProps>> & {
		defaultValue?: string;
		height: LayoutProps["height"];
		hint: string;
	};

export const SmartInput = forwardRef<SmartInputProps, "input">(
	function InnerSmartInput(
		{ defaultValue, placeholder, hint, height, isDisabled, name, ...props },
		ref,
	): JSX.Element {
		const editableBg = useColorModeValue("gray.200", "gray.700");

		return (
			<Editable
				defaultValue={defaultValue}
				placeholder={placeholder}
				isDisabled={isDisabled}
				selectAllOnFocus={false}>
				<Tooltip label={hint}>
					<EditablePreview
						{...props}
						_hover={{
							bg: editableBg,
						}}
					/>
				</Tooltip>
				<Input
					{...props}
					as={EditableInput}
					h={height}
					name={name}
					ref={ref}
				/>
			</Editable>
		);
	},
);
