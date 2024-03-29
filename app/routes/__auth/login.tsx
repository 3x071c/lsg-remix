import type { ActionFunction, LoaderFunction } from "remix";
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
	useToast,
	CircularProgress,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSubmit, redirect } from "remix";
import { useLogin, authenticate, authorize } from "~feat/auth";
import { respond } from "~lib/response";

type LoaderData = { headers: HeadersInit; status: number };
const getLoaderData = async (request: Request): Promise<LoaderData> => {
	const [user, headers] = await authorize(request, { required: false });
	if (user) throw redirect("/admin");
	return { headers, status: 200 };
};
export const loader: LoaderFunction = async ({ request }) =>
	respond<LoaderData>(await getLoaderData(request));

export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const token = form.get("_authorization");

	if (!token || typeof token !== "string")
		throw new Response(
			"Authentifizierung aufgrund fehlendem Tokens fehlgeschlagen",
			{ status: 400, statusText: "Schlechte Anfrage" },
		);

	return authenticate(request, token);
};

export default function Login(): JSX.Element {
	const background = useColorModeValue("gray.50", "gray.700");
	const toast = useToast();

	const { loading, data: token, login } = useLogin();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<{ email: string }>();
	const submit = useSubmit();

	useEffect(() => {
		if (token) {
			const formData = new FormData();
			formData.append("_authorization", token);
			submit(formData, { method: "post" });
		}
	}, [token, submit]);

	if (token) {
		return (
			<Center w="100%" minH="100%" p={2}>
				<CircularProgress isIndeterminate capIsRound />
			</Center>
		);
	}

	return (
		<Center w="100%" minH="100%" p={4}>
			<chakra.main p={8} bg={background} rounded="md">
				<Heading as="h1" textAlign="center">
					Login
				</Heading>
				<form
					// eslint-disable-next-line @typescript-eslint/no-misused-promises -- Looks like the only way
					onSubmit={handleSubmit(({ email }) => {
						login(email).catch((e) =>
							toast({
								description: `Wir wissen auch nicht weiter >:( (${String(
									e,
								)})`,
								duration: 9000,
								isClosable: true,
								status: "error",
								title: "Anmeldung fehlgeschlagen",
							}),
						);
					})}>
					<FormControl
						isRequired
						isInvalid={!!errors.email}
						isDisabled={loading || isSubmitting}
						mt={4}>
						<FormLabel htmlFor="email">
							Ihre E-Mail-Adresse
						</FormLabel>
						<Input
							id="email"
							type="email"
							placeholder="ich@lsg.muenchen.musin.de"
							variant="filled"
							{...register("email", {
								required: true,
							})}
						/>
						{errors.email ? (
							<FormErrorMessage maxW="sm">
								Ohne die korrekte Adresse von der Registration
								können wir nicht sicherstellen, dass es wirklich
								Sie sind
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
						w="full"
						mt={8}
						isLoading={loading || isSubmitting}>
						Anmelden
					</Button>
				</form>
			</chakra.main>
		</Center>
	);
}
