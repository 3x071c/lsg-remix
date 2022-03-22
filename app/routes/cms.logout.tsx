import type { ActionFunction, LoaderFunction } from "remix";
import { Box } from "@chakra-ui/react";
import { redirect } from "remix";
import { logout } from "~app/auth";

export const action: ActionFunction = ({ request }) => {
	return logout(request);
};

export const loader: LoaderFunction = () => {
	return redirect("/");
};

export default function Logout() {
	return <Box />;
}

export const url = "/cms/logout";
