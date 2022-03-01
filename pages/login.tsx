import type { IronSessionUser } from "$types/auth";
import { gql, useMutation } from "@apollo/client";
import {
	Button,
	Center,
	VStack,
	Heading,
	Text,
	Flex,
	useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Input } from "$app/input";

const LOGIN = gql`
	mutation Login($password: String!, $username: String!) {
		login(password: $password, username: $username) {
			id
		}
	}
`;

function Login(): JSX.Element {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [login, { loading, error, data }] =
		useMutation<{ user: IronSessionUser }>(LOGIN);

	const router = useRouter();

	function handleSubmit() {
		void login({
			variables: {
				password,
				username,
			},
		});
	}

	if (data) {
		if (typeof window !== "undefined") {
			void router.push("/cms");
		}
	}

	return (
		<Flex w="100vw" h="100vh">
			<Center w={{ base: "100%", lg: "50%" }} p={8}>
				<VStack spacing={8}>
					<Heading>Login</Heading>
					{error && <Text color="red.400">{error.message}</Text>}
					<Input
						isRequired
						onChange={(e) => {
							setUsername(e.target.value);
						}}
						value={username}
						variant="outline"
						type="text"
						placeholder="username"
					/>
					<Input
						isRequired
						onChange={(e) => {
							setPassword(e.target.value);
						}}
						value={password}
						variant="outline"
						type="password"
						placeholder="password"
					/>
					<Button
						isLoading={loading}
						onClick={() => {
							handleSubmit();
						}}
						w="100%">
						Login
					</Button>
				</VStack>
			</Center>
			<Flex
				direction="column"
				w={{ base: "0%", lg: "50%" }}
				bg={useColorModeValue("brand.500", "brand.600")}
				h="100%"
				p={{ base: 0, lg: 24 }}>
				<Heading size="3xl" my="auto" color="white">
					Content <br /> Management <br /> System
				</Heading>
			</Flex>
		</Flex>
	);
}

export default Login;
