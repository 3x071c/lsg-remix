/* eslint-disable @typescript-eslint/no-redeclare -- Zod inferred typings */
import type { z } from "zod";
import { TickerModel } from "~db";

export const Ticker = TickerModel;
export type Ticker = z.infer<typeof Ticker>;

export const TickerData = Ticker.omit({
	createdAt: true,
	updatedAt: true,
	uuid: true,
});
