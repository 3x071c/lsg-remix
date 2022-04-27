import type { ButtonProps } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Button, forwardRef } from "@chakra-ui/react";
import { Link as RemixLink } from "remix";
import { isExternal } from "./isExternal";

export const LinkButton = forwardRef<
	Overwrite<ButtonProps, { href: string }>,
	"a"
>(function InnerLinkButton({ href, ...props }, ref): JSX.Element {
	if (isExternal(href)) {
		return (
			<Button
				{...props}
				as="a"
				href={href}
				rightIcon={<ExternalLinkIcon />}
				ref={ref}
			/>
		);
	}
	return <Button {...props} as={RemixLink} to={href} ref={ref} />;
});
