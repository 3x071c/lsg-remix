import {
	Link as ChakraLink,
	LinkProps as ChakraLinkProps,
	forwardRef,
} from "@chakra-ui/react";
import { NavLink as RemixNavLink } from "remix";

export default forwardRef<Overwrite<ChakraLinkProps, { href: string }>, "a">(
	function Link({ children, href, ...props }, ref): JSX.Element {
		return (
			<ChakraLink {...props} as={RemixNavLink} to={href} ref={ref}>
				{children}
			</ChakraLink>
		);
	},
);
