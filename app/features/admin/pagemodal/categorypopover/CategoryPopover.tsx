import type { Validator } from "remix-validated-form";
import { AddIcon } from "@chakra-ui/icons";
import {
	useDisclosure,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverArrow,
	PopoverCloseButton,
	ButtonGroup,
	IconButton,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import FocusLock from "react-focus-lock";
import { useTransition } from "remix";
import { ValidatedForm } from "remix-validated-form";
import { FormInput, SubmitButton } from "~feat/form";

export type CategoryPopoverProps = {
	categoryValidator: Validator<{ name: string }>;
	setCloseable: (arg: boolean) => void;
};
export function CategoryPopover({
	categoryValidator,
	setCloseable,
}: CategoryPopoverProps): JSX.Element {
	const { onOpen, onClose, isOpen } = useDisclosure();
	const transition = useTransition();
	const [submitted, setSubmitted] = useState(false);
	const firstFieldRef = useRef(null);

	useEffect(() => {
		if (transition.state === "loading" && submitted) {
			setSubmitted(false);
			onClose();
		}
	}, [transition.state, onClose, submitted]);

	useEffect(() => {
		setCloseable(!isOpen);
	}, [isOpen, setCloseable]);

	return (
		<Popover
			isOpen={isOpen}
			initialFocusRef={firstFieldRef}
			onOpen={onOpen}
			onClose={onClose}
			placement="right"
			closeOnBlur={false}
			isLazy>
			<PopoverTrigger>
				<IconButton
					aria-label="Neue Kategorie erstellen"
					icon={<AddIcon />}
				/>
			</PopoverTrigger>
			<PopoverContent p={5}>
				<FocusLock returnFocus persistentFocus={false}>
					<PopoverArrow />
					<PopoverCloseButton />
					<ValidatedForm validator={categoryValidator} method="post">
						<input
							type="hidden"
							name="_subject"
							value="pageCategory"
						/>
						<FormInput
							type="text"
							name="name"
							placeholder="🪪 Name"
							helper="Wie soll die neue Kategorie heißen?"
							label="Kategorie"
							ref={firstFieldRef}
						/>
						<ButtonGroup d="flex" justifyContent="flex-end">
							<SubmitButton onClick={() => setSubmitted(true)}>
								Erstellen
							</SubmitButton>
						</ButtonGroup>
					</ValidatedForm>
				</FocusLock>
			</PopoverContent>
		</Popover>
	);
}
