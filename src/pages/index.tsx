import type { GetPages } from "$generated/apollo";
import { gql, useQuery } from "@apollo/client";
import { Heading, Container, Center, Text, VStack } from "@chakra-ui/react";
import { Hero } from "$app/hero";
import { Loading, Error } from "$app/indicators";

const GET_PAGES = gql`
	query GetPages {
		pages {
			title
			content
		}
	}
`;

export default function Index(): JSX.Element {
	const { data, loading, error } = useQuery<GetPages>(GET_PAGES);
	if (loading) return <Loading />;
	if (error || !data) return <Error message={error?.message} />;
	return (
		<>
			<Hero />
			<Container>
				<Center>
					<VStack spacing="3vh">
						<Heading as="h1" size="3xl">
							Louise-Schroeder-Gymnasium
						</Heading>
						<Text fontSize="xl">
							Naturwissenschaftlich-technologisches und
							sprachliches Gymnasium in München 🍺
						</Text>
					</VStack>
				</Center>
			</Container>
		</>
	);
}
