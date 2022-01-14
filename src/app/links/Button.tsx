import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
	Button as ChakraButton,
	ButtonProps as ChakraButtonProps,
} from "@chakra-ui/react";
import Linkify from "./Linkify";

export default function Link({
	href,
	...props
}: Overwrite<
	ChakraButtonProps,
	Pick<Parameters<typeof Linkify>[0], "href">
>): JSX.Element {
	const hrefString = href.toString();
	return (
		<Linkify
			href={href}
			whenExternal={
				<ChakraButton
					{...props}
					as="a"
					href={hrefString}
					rightIcon={<ExternalLinkIcon />}
				/>
			}>
			<ChakraButton {...props} as="a" />
		</Linkify>
	);
}
