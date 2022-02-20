/* eslint-disable react/jsx-no-useless-fragment */
import type { PropsWithChildren, ReactNode } from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import isExternal from "./isExternal";

export default function Linkify({
	href,
	whenExternal,
	whenInternal,
	children,
	...props
}: PropsWithChildren<
	NextLinkProps & {
		whenExternal?: ReactNode;
		whenInternal?: ReactNode;
	}
>): JSX.Element {
	if (isExternal(href.toString())) {
		// TypeScript is outdated, returning ReactNodes from React functional components (and using those components in JSX) is totally valid since React 16, but whatever -_-
		// Wrapping in empty fragments as a workaround
		if (whenExternal) return <>{whenExternal}</>;
		return <>{children}</>;
	}
	// passHref prop: https://nextjs.org/docs/api-reference/next/link#if-the-child-is-a-functional-component (Child must be wrapped with React.forwardRef!)
	if (whenInternal)
		return (
			<NextLink {...props} href={href} passHref>
				{whenInternal}
			</NextLink>
		);
	return (
		<NextLink {...props} href={href} passHref>
			{children}
		</NextLink>
	);
}
