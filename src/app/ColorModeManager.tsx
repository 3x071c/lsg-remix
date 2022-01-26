import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import {
	ChakraProvider,
	ChakraProviderProps,
	cookieStorageManager,
	localStorageManager,
} from "@chakra-ui/react";
import theme from "$app/theme";

export default function ColorModeManager({
	cookies,
	...props
}: ChakraProviderProps &
	InferGetServerSidePropsType<typeof getServerSideProps>) {
	const colorModeManager =
		typeof cookies === "string"
			? cookieStorageManager(cookies)
			: localStorageManager;

	return (
		<ChakraProvider
			theme={theme}
			colorModeManager={colorModeManager}
			{...props}
		/>
	);
}

// eslint-disable-next-line require-await
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	return {
		props: {
			// first time users will not have any cookies and you may not return
			// undefined here, hence ?? is necessary
			cookies: req.headers.cookie ?? "",
		},
	};
};

// from: https://chakra-ui.com/docs/features/color-mode#add-colormodemanager-optional-for-ssr
// not implemented due to SSR requirement
