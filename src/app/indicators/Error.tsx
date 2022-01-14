import { RepeatIcon } from "@chakra-ui/icons";
import {
	Button,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	Code,
} from "@chakra-ui/react";
import { useRef } from "react";

export default function ErrorIndicator({
	message,
}: {
	message?: string;
}): JSX.Element {
	const cancelRef = useRef(null);
	const onClose = () => {};

	return (
		<AlertDialog onClose={onClose} isOpen leastDestructiveRef={cancelRef}>
			<AlertDialogOverlay>
				<AlertDialogContent>
					<AlertDialogHeader fontSize="lg" fontWeight="bold">
						Oh nein 🤔
					</AlertDialogHeader>

					<AlertDialogBody>
						Es gab einen kritischen Fehler beim Laden der Seite
						{message ? (
							<>
								: <Code>{message}</Code>
							</>
						) : (
							""
						)}
					</AlertDialogBody>

					<AlertDialogFooter>
						<Button
							ref={cancelRef}
							colorScheme="green"
							ml={3}
							as="a"
							href="/"
							rightIcon={<RepeatIcon />}>
							Nochmal versuchen
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>
	);
}
