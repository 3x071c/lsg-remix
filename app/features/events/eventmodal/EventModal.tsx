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
import { withZod } from "@remix-validated-form/with-zod";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { useTransition } from "remix";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { EventData } from "~models";
import { FormInput, SubmitButton } from "~feat/form";

const locale = "de-DE";

export const EventValidatorData = EventData.omit({
	createdByUUID: true,
})
	.extend({
		endsAt: z
			.string()
			.regex(/^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d$/g, {
				message:
					"Muss ein valides Datum im Format YYYY-MM-DDThh:mm sein",
			})
			.refine(
				(val) =>
					DateTime.fromISO(val).startOf("minute") >=
					DateTime.now().startOf("minute"),
				{ message: "Datum liegt in der Vergangenheit" },
			),
		startsAt: z
			.string()
			.regex(/^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d$/g, {
				message:
					"Muss ein valides Datum im Format YYYY-MM-DDThh:mm sein",
			})
			.refine(
				(val) =>
					DateTime.fromISO(val).startOf("minute") >=
					DateTime.now().startOf("minute"),
				{ message: "Datum liegt in der Vergangenheit" },
			),
	})
	.refine(
		(event) =>
			DateTime.fromISO(event.endsAt) >= DateTime.fromISO(event.startsAt),
		{ message: "Enddatum muss nach dem Startdatum liegen!" },
	);
export const EventValidator = withZod(EventValidatorData);

export function EventModal({
	isOpen,
	onClose,
	errorMessage,
}: {
	isOpen: boolean;
	onClose: () => void;
	errorMessage?: string;
}): JSX.Element {
	const transition = useTransition();
	const [submitted, setSubmitted] = useState(false);

	useEffect(() => {
		if (transition.state === "loading" && submitted) {
			setSubmitted(false);
			onClose();
		}
	}, [transition.state, onClose, submitted]);

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay backdropFilter="auto" backdropBlur="10px" />
			<ValidatedForm validator={EventValidator} method="post">
				<ModalContent>
					<ModalHeader>Neuer Termin</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<FormInput
							type="text"
							name="title"
							placeholder="🔤 Titel"
							helper="Eine kurze, prägnante Terminbeschreibung, welche zur öffentlichen Information dient"
							label="Der Titel"
						/>
						<FormInput
							type="datetime-local"
							name="startsAt"
							helper="Das Startdatum mit Uhrzeit, welche öffentlich angezeigt wird"
							label="Von"
							min={DateTime.now()
								.setLocale(locale)
								.toFormat("yyyy-MM-dd'T'HH':'mm")}
						/>
						<FormInput
							type="datetime-local"
							name="endsAt"
							helper="Das Enddatum mit Uhrzeit, welche öffentlich angezeigt wird"
							label="Bis"
							min={DateTime.now()
								.setLocale(locale)
								.toFormat("yyyy-MM-dd'T'HH':'mm")}
						/>
					</ModalBody>
					<ModalFooter>
						<VStack align="stretch" justify="flex-start" w="full">
							<SubmitButton
								w="full"
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
			</ValidatedForm>
		</Modal>
	);
}
