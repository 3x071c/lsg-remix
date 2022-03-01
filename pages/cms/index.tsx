import type { IronSessionUser } from "$types/auth";
import { Center, Heading } from "@chakra-ui/react";
import { CmsLayout } from "$app/layout";
import { ssrAuth } from "$lib/auth";

interface Props {
	user?: IronSessionUser;
}

function Index({ user }: Props): JSX.Element {
	return (
		<Center height="100%">
			<Heading>Welcome Back, User {user?.id}</Heading>
		</Center>
	);
}

Index.getLayout = CmsLayout.getLayout("home");

export const getServerSideProps = ssrAuth(({ req }) => {
	const { user } = req.session;

	if (!user) {
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};
	}

	return {
		props: {
			user: req.session.user,
		},
	};
});

export default Index;
