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
import { login } from "~app/auth";

export default function Login(): JSX.Element {
	const background = useColorModeValue("gray.50", "gray.700");
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<{ email: string }>();
	const onSubmit = handleSubmit(async ({ email }) => {
		await login(email);
	});

	return (
		<Center minW="100vw" minH="100vh">
			<chakra.main p={8} rounded="md" bg={background}>
				<Heading textAlign="center">Login</Heading>
				{/* eslint-disable-next-line @typescript-eslint/no-misused-promises -- External API */}
				<form onSubmit={onSubmit}>
					<FormControl isRequired isInvalid={!!errors.email} mt={3}>
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
							<FormErrorMessage>
								Ohne die korrekte Adresse von der Registration
								können wir nicht sicherstellen, dass es wirklich
								Sie sind
							</FormErrorMessage>
						) : (
							<FormHelperText>
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
	);
}

export const url = "/cms/login";
