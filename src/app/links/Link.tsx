import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
	Link as ChakraLink,
	LinkProps as ChakraLinkProps,
} from "@chakra-ui/react";
import Linkify from "./Linkify";

export default function Link({
	href,
	...props
}: Overwrite<
	ChakraLinkProps,
	Pick<Parameters<typeof Linkify>[0], "href">
>): JSX.Element {
	const hrefString = href.toString();
	return (
		<Linkify
			href={href}
			whenExternal={
				<ChakraLink {...props} isExternal href={hrefString}>
					{props.children} <ExternalLinkIcon mx="2px" />
				</ChakraLink>
			}>
			<ChakraLink {...props} />
		</Linkify>
	);
}
