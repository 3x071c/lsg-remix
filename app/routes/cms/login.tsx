import {
	Center,
	Heading,
	chakra,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	useColorModeValue,
	Input,
	Button,
	FormLabel,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { ActionFunction, json } from "remix";
import { useLogin, authenticate } from "~app/auth";

export const getActionData = (request: Request, env: AppLoadContextEnvType) => {
	return authenticate(request, env);
};
type ActionData = Awaited<ReturnType<typeof getActionData>>;
export const action: ActionFunction = async ({ request, context: { env } }) =>
	json<ActionData>(
		await getActionData(request, env as AppLoadContextEnvType),
		400,
	);

export default function Login(): JSX.Element {
	const { data, login } = useLogin();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<{ email: string }>();
	const onSubmit = handleSubmit(async ({ email }) => {
		await login(email);
	});
	const background = useColorModeValue("gray.50", "gray.700");

	if (data) {
		return (
			<Center minW="100vw" minH="100vh">
				<chakra.main p={8} rounded="md" bg={background}>
					<Heading textAlign="center">Fast fertig!</Heading>
					<form method="post">
						<input
							type="hidden"
							name="authorization"
							value={data}
						/>
						<Button w="full" type="submit">
							Anmeldung abschließen
						</Button>
					</form>
				</chakra.main>
			</Center>
		);
	}

	return (
		<>
			<Center minW="100vw" minH="100vh">
				<chakra.main p={8} rounded="md" bg={background}>
					<Heading textAlign="center">Login</Heading>
					{/* eslint-disable-next-line @typescript-eslint/no-misused-promises -- External API */}
					<form onSubmit={onSubmit}>
						<FormControl
							isRequired
							isInvalid={!!errors.email}
							mt={3}
							isDisabled={isSubmitting}>
							<FormLabel htmlFor="email">
								Ihre E-Mail-Adresse
							</FormLabel>
							<Input
								id="email"
								type="email"
								pattern="^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
								placeholder="ich@lsg.muenchen.musin.de"
								variant="filled"
								{...register("email", {
									pattern:
										/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
									required: true,
								})}
							/>
							{errors.email ? (
								<FormErrorMessage maxW="sm">
									Ohne die korrekte Adresse von der
									Registration können wir nicht sicherstellen,
									dass es wirklich Sie sind
								</FormErrorMessage>
							) : (
								<FormHelperText maxW="sm">
									Nutzen Sie die Adresse, welche bei der
									Registration für Sie angegeben wurde
								</FormHelperText>
							)}
						</FormControl>
						<Button type="submit" mt={2} isLoading={isSubmitting}>
							Hinzufügen
						</Button>
					</form>
				</chakra.main>
			</Center>
			{/* <Modal
				isCentered
				isOpen={loading}
				onClose={onClose}
				initialFocusRef={initialFocusRef}
				motionPreset="slideInBottom">
				<ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
				<ModalContent>
					<ModalHeader>E-Mail gesendet</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<Text>
							Bitte überprüfe deine E-Mails zur Verifikation.
						</Text>
					</ModalBody>
					<ModalFooter>
						<Button
							mr={3}
							isLoading={loading}
							ref={initialFocusRef}>
							Warten
						</Button>
						<Button variant="ghost" onClick={onClose}>
							Vertippt
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal> */}
		</>
	);
}

export const url = "/cms/login";
