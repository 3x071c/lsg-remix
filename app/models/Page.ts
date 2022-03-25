/* eslint-disable @typescript-eslint/no-redeclare -- Make Zod typings usable */

import { z } from "zod";
import handler from "./_handler";
import { Title, UUID } from "./_shared";

const rawPage = {
	groupRef: UUID,
	title: Title,
	uuid: UUID,
};
export const Page = z.object(rawPage);
export type Page = z.infer<typeof Page>;

export const pages = handler<Page, typeof rawPage>("pages", "Seiten", Page);
