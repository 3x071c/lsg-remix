/* eslint-disable @typescript-eslint/no-redeclare -- Make Zod typings usable */

import { z } from "zod";
import handler from "./_handler";
import { Title, UUID, DateType } from "./_shared";

export const Page = z.object({
	createdAt: DateType,
	editedAt: DateType,
	groupRef: UUID,
	title: Title,
	uuid: UUID,
});
export type Page = z.infer<typeof Page>;

export const pages = handler<Page, typeof Page["shape"], typeof Page>(
	Page,
	"pages",
	"Seiten",
);
