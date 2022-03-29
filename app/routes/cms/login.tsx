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
import { ActionFunction, redirect, Form } from "remix";
import { useLogin, sessionStorage } from "~app/auth";
import { magicServer } from "~app/magic";
import { users, User } from "~app/models";
import { entries } from "~app/util";
import { url as cmsURL } from "~routes/cms";

const ChakraForm = chakra(Form);

export const action: ActionFunction = async ({
	request,
	context: { env: _env },
}) => {
	const env = _env as AppLoadContextEnvType;
	const magic = magicServer(env);
	const form = await request.formData();
	const didToken = form.get("_authorization");
	if (!didToken || typeof didToken !== "string")
		throw new Error(
			"Authentifizierung aufgrund fehlendem Tokens fehlgeschlagen",
		);
	magic.token.validate(didToken);
	/* 🚨 Important: Make sure the token is valid and **hasn't expired**, before authorizing access to user data! */
	const { issuer: did } = await magic.users.getMetadataByToken(didToken);
	/* Get user UUID */
	const userEnv = users(env);
	const didValues = await userEnv.listValues("did");
	const uuids = didValues.data
		.map(({ uuid, value }) => (value === did ? uuid : false))
		.filter(Boolean);
	if (uuids.length > 1) throw new Error("Mehrere Nutzer auf einem Datensatz");
	if (uuids.length === 0) throw new Error("Nutzer nicht gefunden");
	const uuid = uuids[0] as string;

	const session = await sessionStorage.getSession(
		request.headers.get("Cookie"),
	);
	entries(
		User.parse(await userEnv.getMany(uuid, ["firstname", "lastname"])),
	).map(([k, v]) => session.set(k, v));

	return redirect(cmsURL, {
		headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
	});
};

export default function Login(): JSX.Element {
	const { loading, data, login } = useLogin();
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
					<ChakraForm method="post" p={4}>
						<input
							type="hidden"
							name="_authorization"
							value={data}
						/>
						<Button w="full" type="submit">
							Anmeldung abschließen
						</Button>
					</ChakraForm>
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
							isDisabled={isSubmitting || loading}>
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
						<Button
							type="submit"
							mt={2}
							isLoading={isSubmitting || loading}>
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
