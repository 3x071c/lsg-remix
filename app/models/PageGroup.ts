/* eslint-disable @typescript-eslint/no-redeclare -- Make Zod typings usable */

import { z } from "zod";
import handler from "./_handler";
import { Name, UUID } from "./_shared";

const rawPageGroup = {
	name: Name,
	uuid: UUID,
};
export const PageGroup = z.object(rawPageGroup);
export type PageGroup = z.infer<typeof PageGroup>;

export const pageGroups = handler<PageGroup, typeof rawPageGroup>(
	"pageGroups",
	"Seitengruppierungen",
	PageGroup,
);
