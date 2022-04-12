/* eslint-disable no-underscore-dangle -- Private APIs */
import type { DateType } from "./_shared";
import type { SuperJSONResult } from "superjson/dist/types";
import type { z } from "zod";
import superjson from "superjson";
import { entries, fromEntries } from "~app/util";
import { UUID } from "./_shared";

type Reserved = {
	uuid: UUID;
	createdAt: DateType;
	editedAt: DateType;
};

const handler =
	<
		R extends Record<string, unknown> & Reserved,
		S extends { [K in keyof R]: z.ZodType<R[K]> },
		M extends z.ZodObject<S>,
	>(
		model: M,
		binding: string,
		friendly: string,
	) =>
	() => {
		if (!global.env[binding])
			throw new Error(`Zugriff auf ${friendly} aktuell nicht möglich`);
		const ctx = global.env[binding]!;
		if (typeof ctx === "string")
			throw new Error(`${friendly} aktuell falsch`);

		return {
			_constructKey<T extends keyof Omit<R, "uuid">>(
				uuid: R["uuid"],
				field: T,
				validateUUID = true,
				validateField = true,
			): string {
				return `${
					validateField
						? this._validateField(field)
						: field.toString()
				}:${validateUUID ? this._validateUUID(uuid) : uuid}`;
			},
			_constructValue<T extends keyof Omit<R, "uuid">>(
				field: T,
				value: R[T],
			): string {
				return JSON.stringify({
					superjson: superjson.serialize(
						this._validateValue(field, value),
					),
				});
			},
			_validateField<T extends keyof Omit<R, "uuid">>(field: T): string {
				const parsedField = field.toString();
				if (!Object.keys(model.shape).includes(parsedField))
					throw new Error("[_arrayField] Invalider Schlüsselzugriff");
				return parsedField;
			},
			_validateModel(_model: R): R {
				return model.parse(_model) as R;
			},
			_validateUUID(uuid: R["uuid"]): R["uuid"] {
				return UUID.parse(uuid);
			},
			_validateValue<T extends keyof Omit<R, "uuid">>(
				field: T,
				value?: R[T],
			): R[T] {
				return model.shape[field].parse(value) as R[T];
			},
			async create(_data: Omit<R, "uuid">): Promise<R> {
				const uuid = crypto.randomUUID();
				const data: Omit<R, "uuid"> = {
					..._data,
					createdAt: new Date(),
					editedAt: new Date(),
				};
				await Promise.all(
					entries(data).map(([field, value]) =>
						ctx.put(
							this._constructKey(uuid, field),
							this._constructValue(field, value),
						),
					),
				);
				return this._validateModel({ ...data, uuid } as R);
			},
			async get<
				T extends keyof Omit<R, "uuid">,
				O extends Pick<KVNamespaceGetOptions<"json">, "cacheTtl"> & {
					required?: boolean;
				},
			>(
				uuid: R["uuid"],
				field: T,
				options?: O,
			): Promise<
				O extends { required: false } ? R[T] | undefined : R[T]
			> {
				const cacheTtl = options?.cacheTtl ?? 3600;
				const required = options?.required ?? true;

				const value = await ctx.get<{ superjson?: SuperJSONResult }>(
					this._constructKey(uuid, field),
					{
						cacheTtl,
						type: "json",
					},
				);

				try {
					return this._validateValue(
						field,
						value?.superjson
							? superjson.deserialize(value.superjson)
							: undefined,
					);
				} catch (e) {
					if (required) throw e;
					return undefined as O extends { required: false }
						? R[T] | undefined
						: R[T];
				}
			},
			async getMany<
				T extends keyof Omit<R, "uuid">,
				O extends Pick<KVNamespaceGetOptions<"json">, "cacheTtl"> & {
					required?: boolean;
				},
			>(
				uuid: R["uuid"],
				fields: ReadonlyArray<T>,
				options?: O,
			): Promise<{
				[field in typeof fields extends ReadonlyArray<infer U>
					? U
					: never]: O extends { required: false }
					? R[field] | undefined
					: R[field];
			}> {
				return fromEntries(
					await Promise.all(
						fields.map(
							async (field) =>
								[
									field,
									await this.get(uuid, field, options),
								] as const,
						),
					),
				) as {
					[field in typeof fields extends ReadonlyArray<infer U>
						? U
						: never]: O extends { required: false }
						? R[field] | undefined
						: R[field];
				};
			},
			async list<
				T extends keyof Omit<R, "uuid">,
				O extends Pick<KVNamespaceListOptions, "cursor" | "limit"> & {
					required?: boolean;
				},
			>(field: T, options?: O) {
				const prefix = this._constructKey("", field, false);
				const required = options?.required ?? !options?.limit;
				const {
					cursor,
					keys,
					list_complete: listComplete,
				} = await ctx.list({
					cursor: options?.cursor,
					limit: options?.limit,
					prefix,
				});
				if (required && !listComplete)
					throw new Error("Nicht vollständiger Rückgabewert");
				const data = keys.map(({ name, ...rest }) => ({
					...rest,
					uuid: this._validateUUID(name.replace(prefix, "")),
				}));
				return {
					cursor,
					data,
					listComplete,
				};
			},
			async listValues<
				T extends keyof Omit<R, "uuid">,
				O extends Pick<KVNamespaceListOptions, "cursor" | "limit"> &
					Pick<KVNamespaceGetOptions<"json">, "cacheTtl"> & {
						required?: boolean;
					},
			>(field: T, options?: O) {
				const {
					cursor,
					data: keys,
					listComplete,
				} = await this.list(field, {
					cursor: options?.cursor,
					limit: options?.limit,
					required: options?.required,
				});
				const data = await Promise.all(
					keys.map(async ({ uuid, ...rest }) => ({
						...rest,
						uuid,
						value: await this.get(uuid, field, options),
					})),
				);
				return {
					cursor,
					data,
					listComplete,
				};
			},
			async update({
				uuid,
				..._data
			}: Partial<Omit<R, keyof Reserved>> & { uuid: R["uuid"] }) {
				const data = {
					..._data,
					editedAt: new Date(),
				} as unknown as Omit<Partial<R>, "uuid">;
				await Promise.all(
					entries(data).map(([field, value]) =>
						ctx.put(
							this._constructKey(uuid, field),
							this._constructValue(
								field,
								value as R[typeof field] /* TS sucks */,
							),
						),
					),
				);
				return { ...data, uuid };
			},
		};
	};
export default handler;

/*
 * KV schema:
 * `<field>:<uuid>` -> superjson { value: <value> }
 * -> 1 write (update), 1 read (field), * search (`<field>:*`)
 */
