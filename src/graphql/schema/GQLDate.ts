import { DateTimeResolver } from "graphql-scalars";
import { asNexusMethod } from "nexus";

export const GQLDate = asNexusMethod(DateTimeResolver, "date");
