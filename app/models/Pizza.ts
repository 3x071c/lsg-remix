/* eslint-disable @typescript-eslint/no-redeclare -- Zod inferred typings */
import type { z } from "zod";
import { PizzaModel } from "~db";

export const Pizza = PizzaModel;
export type Pizza = z.infer<typeof Pizza>;

export const PizzaData = Pizza.omit({
	createdAt: true,
	updatedAt: true,
	uuid: true,
});
