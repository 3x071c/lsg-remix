import { DateTimeResolver } from "graphql-scalars";
import { asNexusMethod } from "nexus";

export const Date = asNexusMethod(DateTimeResolver, "date");
