/* eslint-disable @typescript-eslint/no-redeclare -- Zod inferred typings */
import type { PizzaOrder as PrismaPizzaOrder } from "@prisma/client";
import type { z } from "zod";
import { PizzaOrderModel } from "~db";

export const PizzaOrder: z.ZodObject<{
	[K in keyof PrismaPizzaOrder]: z.ZodType<PrismaPizzaOrder[K]>;
}> = PizzaOrderModel;
export type PizzaOrder = z.infer<typeof PizzaOrder>;
