/* eslint-disable @typescript-eslint/no-redeclare -- Zod inferred typings */
import type { z } from "zod";
import { EventModel } from "~db";

export const Event = EventModel;
export type Event = z.infer<typeof Event>;

export const EventData = Event.omit({
	createdAt: true,
	updatedAt: true,
	uuid: true,
});
