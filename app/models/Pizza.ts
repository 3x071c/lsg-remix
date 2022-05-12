/* eslint-disable @typescript-eslint/no-redeclare -- Zod inferred typings */
import type { Pizza as PrismaPizza } from "@prisma/client";
import type { z } from "zod";
import { PizzaModel } from "~db";

export const Pizza: z.ZodObject<{
	[K in keyof PrismaPizza]: z.ZodType<PrismaPizza[K]>;
}> = PizzaModel;
export type Pizza = z.infer<typeof Pizza>;

export const PizzaData = Pizza.omit({
	createdAt: true,
	updatedAt: true,
	uuid: true,
});
