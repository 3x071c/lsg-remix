import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Button, ButtonProps, forwardRef } from "@chakra-ui/react";
import { Link as RemixLink } from "remix";
import isExternal from "./isExternal";

export default forwardRef<Overwrite<ButtonProps, { href: string }>, "a">(
	function LinkButton({ href, ...props }, ref): JSX.Element {
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
		return <Button as={RemixLink} to={href} ref={ref} />;
	},
);
