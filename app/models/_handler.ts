/* eslint-disable @typescript-eslint/no-redeclare -- Make Zod typings usable */
/* eslint-disable no-underscore-dangle -- Private APIs */
import superjson from "superjson";
import { z, ZodObject, ZodRawShape, ZodType } from "zod";
import entries from "~app/util/entries";
import { UUID } from "./_shared";

const handler =
	<M extends { uuid: UUID }, R extends { [key in keyof M]: ZodType<M[key]> }>(
		binding: string,
		friendly: string,
		model: ZodObject<R>,
	) =>
	(env: AppLoadContextEnvType) => {
		if (!env[binding])
			throw new Error(`Zugriff auf ${friendly} aktuell nicht möglich`);
		const ctx = env[binding]!;
		return {
			_constructKey<T extends keyof Omit<M, "uuid">>(
				uuid: M["uuid"],
				field: T,
			): string {
				return `${this._validateField(field)}:${this._validateUUID(
					uuid,
				)}`;
			},
			_constructValueWithMetadata<T extends keyof Omit<M, "uuid">>(
				field: T,
				value: M[T],
			): [string, KVNamespacePutOptions] {
				const validatedValue = this._validateValue(field, value);
				const { json, meta } = superjson.serialize(validatedValue);
				return [JSON.stringify(json), { metadata: meta }];
			},
			_validateField<T extends keyof Omit<M, "uuid">>(field: T): string {
				const parsedField = field.toString();
				if (!Object.keys(model.shape).includes(parsedField))
					throw new Error("[_arrayField] Invalider Schlüsselzugriff");
				return parsedField;
			},
			_validateUUID(uuid: M["uuid"]): string {
				return UUID.parse(uuid);
			},
			_validateValue<T extends keyof Omit<M, "uuid">>(
				field: T,
				value: M[T],
			) {
				return model.shape[field].parse(value);
			},
			async create(data: Omit<M, "uuid">): Promise<M> {
				const uuid = crypto.randomUUID();
				await Promise.all(
					entries(data).map(([field, value]) =>
						ctx.put(
							this._constructKey(uuid, field),
							...this._constructValueWithMetadata(field, value),
						),
					),
				);
				return { ...data, uuid };
			},
			async getFieldValue<T extends keyof Omit<M, "uuid">>(
				uuid: M["uuid"],
				field: T,
				cache = 3600,
			): Promise<M[T] | undefined> {
				const { value, metadata: meta } = await ctx.getWithMetadata(
					this._constructKey(uuid, field),
					{
						cacheTtl: cache,
						type: "json",
					},
				);
				if (!matches) return undefined;
				return matches;
			},
			async getFieldValues<T extends keyof Omit<M, "uuid">>(
				field: T,
				value: M[T],
				cache = 3600,
			): Promise<M["uuid"][]> {
				const matches = await ctx.get<M["uuid"][]>(
					`${field}:${value}`,
					{
						cacheTtl: cache,
						type: "json",
					},
				);
				if (!matches) return [];
				return matches;
			},
			list({
				cursor,
				limit,
			}: Pick<KVNamespaceListOptions, "cursor" | "limit">) {
				return ctx.list({ cursor, limit });
			},
			async update(
				{ uuid, ...data }: PartialExcept<M, "uuid">,
				cache = 3600,
			) {
				await Promise.all(
					Object.entries(data).map(async ([k, v]) => {
						await ctx.put(`by-uuid:${uuid}:${k}`, v as string);
						await this._arrayField(
							uuid,
							k as keyof Omit<M, "uuid">,
							v as string,
							cache,
						);
					}),
				);
			},
		};
	};
export default handler;

/*
 * KV schema:
 * `<field>:<uuid>` -> superjson { value: <value> }
 * -> 1 write (update), 1 read (field), * search (`<field>:*`)
 */
