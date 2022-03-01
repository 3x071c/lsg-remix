import type { GetPages } from "$generated/apollo";
import type { ReactElement } from "react";
import { gql, useQuery } from "@apollo/client";
import { Heading, Center, Text, VStack } from "@chakra-ui/react";
import { Hero } from "$app/hero";
import { Loading, Error } from "$app/indicators";
import { Container, useBreakpoints } from "$app/layout";

const GET_PAGES = gql`
	query GetPages {
		pages {
			title
			content
		}
	}
`;

function Index(): JSX.Element {
	const spacing = useBreakpoints((k, _v, i) => [k, `${(i + 1) ** 2}px`]);
	const { data, loading, error } = useQuery<GetPages>(GET_PAGES);
	if (loading) return <Loading />;
	if (error || !data) return <Error message={error?.message} />;

	return (
		<>
			<Hero />
			<Container>
				<Center>
					<VStack spacing={spacing}>
						<Heading as="h1" size="xl">
							Epic Heading 😎
						</Heading>
						<Text fontSize="md">Noch epischerer Text 🔫</Text>
					</VStack>
				</Center>
			</Container>
		</>
	);
}

Index.getLayout = (page: ReactElement) => {
	return <Container>{page}</Container>;
};

export default Index;
