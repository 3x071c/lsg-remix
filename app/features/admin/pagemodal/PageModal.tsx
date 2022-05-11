import {
	Text,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTransition } from "remix";
import { ValidatedForm } from "remix-validated-form";
import { PageValidator } from "~models";
import { FormInput, FormSelect, SubmitButton } from "~feat/form";
import { CategoryPopover } from "./categorypopover";

export function PageModal({
	isOpen,
	onClose,
	categoryData,
	errorMessage,
}: {
	isOpen: boolean;
	onClose: () => void;
	categoryData: {
		uuid: string;
		name: string;
	}[];
	errorMessage?: string;
}): JSX.Element {
	const transition = useTransition();
	const [submitted, setSubmitted] = useState(false);
	const [closeable, setCloseable] = useState(true);

	useEffect(() => {
		if (transition.state === "loading" && submitted) {
			setSubmitted(false);
			onClose();
		}
	}, [transition.state, onClose, submitted]);

	return (
		<Modal
			isOpen={!closeable || isOpen}
			onClose={closeable ? onClose : () => {}}
			closeOnEsc={closeable}
			closeOnOverlayClick={closeable}>
			<ModalOverlay backdropFilter="auto" backdropBlur="10px" />
			<ModalContent>
				<ModalHeader>Neue Seite</ModalHeader>
				{closeable && <ModalCloseButton />}
				<ValidatedForm
					validator={PageValidator}
					method="post"
					id="pageForm"
				/>
				<input
					type="hidden"
					name="_subject"
					value="page"
					form="pageForm"
				/>
				<ModalBody>
					<FormInput
						type="text"
						name="title"
						placeholder="🔤 Titel"
						helper="Der Name der neuen Seite, welcher u.a. in der Navigationsleiste oben angezeigt wird"
						label="Der Titel"
						form="pageForm"
						formId="pageForm"
					/>
					<FormSelect
						name="categoryUUID"
						placeholder="✍️ Kategorie auswählen"
						helper="Die Kategorie der Seite, welche zur Eingliederung u.a. in der Navigationsleiste verwendet wird"
						label="Die Kategorie"
						form="pageForm"
						formId="pageForm"
						rightChild={
							<CategoryPopover setCloseable={setCloseable} />
						}>
						{categoryData.map(({ uuid, name }) => (
							<option value={uuid} key={uuid}>
								{name}
							</option>
						))}
					</FormSelect>
				</ModalBody>
				<ModalFooter>
					<VStack align="stretch" justify="flex-start" w="full">
						<SubmitButton
							w="full"
							form="pageForm"
							formId="pageForm"
							onClick={() => setSubmitted(true)}>
							Erstellen
						</SubmitButton>
						{errorMessage && (
							<Text maxW="sm" mt={2} color="red.400">
								{String(errorMessage)}
							</Text>
						)}
					</VStack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
