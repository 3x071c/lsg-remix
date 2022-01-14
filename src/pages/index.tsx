import type { GetPages } from "$generated/apollo";
import { gql, useQuery } from "@apollo/client";
import { Heading } from "@chakra-ui/react";
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
	return <Heading>Yay</Heading>;
}
