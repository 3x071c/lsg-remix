import type { LinkProps as ChakraLinkProps } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Link as ChakraLink, forwardRef } from "@chakra-ui/react";
import { Link as RemixLink } from "remix";
import { isExternal } from ".";

export const Link = forwardRef<
	Overwrite<ChakraLinkProps, { href: string }>,
	"a"
>(function InnerLink({ children, href, ...props }, ref): JSX.Element {
	if (isExternal(href)) {
		return (
			<ChakraLink {...props} isExternal href={href} ref={ref}>
				{children} <ExternalLinkIcon mx={2} />
			</ChakraLink>
		);
	}
	return (
		<ChakraLink {...props} as={RemixLink} to={href} ref={ref}>
			{children}
		</ChakraLink>
	);
});
