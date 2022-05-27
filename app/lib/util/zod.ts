/* eslint-disable no-underscore-dangle */
import type {
	objectInputType,
	objectOutputType,
	ZodNullableDef,
	ZodOptionalDef,
	ZodRawShape,
	ZodTypeAny,
} from "zod";
import { ZodObject, ZodOptional, ZodNullable } from "zod";
import { entries, fromEntries } from ".";

export type ZodDenullish<T extends ZodTypeAny> = T extends
	| ZodNullable<infer U>
	| ZodOptional<infer U>
	? ZodDenullish<U>
	: T;

const denullish = <T extends ZodTypeAny>(schema: T): ZodDenullish<T> =>
	schema instanceof ZodNullable || schema instanceof ZodOptional
		? denullish((schema._def as ZodNullableDef | ZodOptionalDef).innerType)
		: schema;

type UnknownKeysParam = "passthrough" | "strict" | "strip";

export function denullishify<
	T extends ZodRawShape,
	UnknownKeys extends UnknownKeysParam = "strip",
	Catchall extends ZodTypeAny = ZodTypeAny,
	Output = objectOutputType<T, Catchall>,
	Input = objectInputType<T, Catchall>,
>(
	this: ZodObject<T, UnknownKeys, Catchall, Output, Input>,
): ZodObject<{ [k in keyof T]: ZodDenullish<T[k]> }, UnknownKeys, Catchall> {
	return new ZodObject({
		...this._def,
		shape: () => fromEntries(entries(this.shape).map(([field, schema]) => [field, denullish(schema)]),
	});
}
