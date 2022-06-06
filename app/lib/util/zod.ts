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

export type ZodDenullishShape<T extends ZodRawShape> = {
	[k in keyof T]: ZodDenullish<T[k]>;
};

export const denullish = <T extends ZodTypeAny>(schema: T): ZodDenullish<T> =>
	(schema instanceof ZodNullable || schema instanceof ZodOptional
		? denullish((schema._def as ZodNullableDef | ZodOptionalDef).innerType)
		: schema) as ZodDenullish<T>;

type UnknownKeysParam = "passthrough" | "strict" | "strip";

export function denullishShape<
	T extends ZodRawShape,
	UnknownKeys extends UnknownKeysParam = "strip",
	Catchall extends ZodTypeAny = ZodTypeAny,
	Output = objectOutputType<T, Catchall>,
	Input = objectInputType<T, Catchall>,
>(
	obj: ZodObject<T, UnknownKeys, Catchall, Output, Input>,
): ZodObject<ZodDenullishShape<T>, UnknownKeys, Catchall> {
	const a = entries(obj.shape).map(
		([field, schema]) => [field, denullish(schema)] as const,
	) as {
		[K in keyof T]: [K, ZodDenullish<T[K]>];
	}[keyof T][];
	return new ZodObject({
		...obj._def,
		shape: () => fromEntries(a) as unknown as ZodDenullishShape<T>, // TODO: Safely assert type
	});
}
