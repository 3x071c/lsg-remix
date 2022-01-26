import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
	Link as ChakraLink,
	LinkProps as ChakraLinkProps,
	forwardRef,
} from "@chakra-ui/react";
import Linkify from "./Linkify";

/* jscpd:ignore-start */
export default forwardRef<
	Overwrite<ChakraLinkProps, Pick<Parameters<typeof Linkify>[0], "href">>,
	"a"
>(({ href, ...props }, ref): JSX.Element => {
	const hrefString = href.toString();
	return (
		<Linkify
			href={href}
			whenExternal={
				<ChakraLink {...props} isExternal href={hrefString} ref={ref}>
					{props.children} <ExternalLinkIcon mx="2px" />
				</ChakraLink>
			}>
			<ChakraLink {...props} ref={ref} />
		</Linkify>
	);
});
/* jscpd:ignore-end */
