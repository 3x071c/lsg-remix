/* eslint-disable @typescript-eslint/no-redeclare -- Make Zod typings usable */

import { z } from "zod";
import handler from "./_handler";
import { Title, UUID, Date } from "./_shared";

const rawPage = {
	createdAt: Date,
	editedAt: Date,
	groupRef: UUID,
	title: Title,
	uuid: UUID,
};
export const Page = z.object(rawPage);
export type Page = z.infer<typeof Page>;

export const pages = handler<Page, typeof rawPage>("pages", "Seiten", Page);
