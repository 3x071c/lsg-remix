import type { IconButtonProps } from "@chakra-ui/react";
import { IconButton, forwardRef } from "@chakra-ui/react";
import { Link as RemixLink } from "remix";
import { isExternal } from "./isExternal";

export const LinkIconButton = forwardRef<
	Overwrite<IconButtonProps, { href: string }>,
	"a"
>(function InnerLinkIconButton({ href, ...props }, ref): JSX.Element {
	if (isExternal(href)) {
		return <IconButton {...props} as="a" href={href} ref={ref} />;
	}
	return <IconButton {...props} as={RemixLink} to={href} ref={ref} />;
});
