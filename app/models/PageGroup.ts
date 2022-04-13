/* eslint-disable @typescript-eslint/no-redeclare -- Make Zod typings usable */

import { z } from "zod";
import handler from "./_handler";
import { Name, UUID, DateType } from "./_shared";

export const PageGroup = z.object({
	createdAt: DateType,
	editedAt: DateType,
	name: Name,
	uuid: UUID,
});
export type PageGroup = z.infer<typeof PageGroup>;
export const PageGroupData = PageGroup.omit({
	createdAt: true,
	editedAt: true,
	uuid: true,
});
export type PageGroupData = z.infer<typeof PageGroupData>;

export const pageGroups = handler<
	PageGroup,
	typeof PageGroup["shape"],
	typeof PageGroup
>(PageGroup, "pageGroups", "Seitengruppierungen");
