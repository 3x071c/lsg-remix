import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
	Button as ChakraButton,
	ButtonProps as ChakraButtonProps,
	forwardRef,
} from "@chakra-ui/react";
import Linkify from "./Linkify";

/* jscpd:ignore-start */
export default forwardRef<
	Overwrite<ChakraButtonProps, Pick<Parameters<typeof Linkify>[0], "href">>,
	"a"
>(({ href, ...props }, ref): JSX.Element => {
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
					ref={ref}
				/>
			}>
			<ChakraButton {...props} as="a" ref={ref} />
		</Linkify>
	);
});
/* jscpd:ignore-end */
