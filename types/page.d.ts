import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";

// eslint-disable-next-line @typescript-eslint/ban-types
export type Page<P = {}> = NextPage<P> & {
	getLayout?: (page: ReactElement) => ReactNode;
};
