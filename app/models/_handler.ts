/* eslint-disable no-underscore-dangle -- Private APIs */
import type { SuperJSONResult } from "superjson/dist/types";
import type { ZodObject, ZodType } from "zod";
import superjson from "superjson";
import { entries, fromEntries } from "~app/util";
import { UUID } from "./_shared";

const handler =
	<M extends { uuid: UUID }, R extends { [key in keyof M]: ZodType<M[key]> }>(
		binding: string,
		friendly: string,
		model: ZodObject<R>,
	) =>
	() => {
		if (!global.env[binding])
			throw new Error(`Zugriff auf ${friendly} aktuell nicht möglich`);
		const ctx = global.env[binding]!;
		if (typeof ctx === "string")
			throw new Error(`${friendly} aktuell falsch`);

		return {
			_constructKey<T extends keyof Omit<M, "uuid">>(
				uuid: M["uuid"],
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
			_constructValue<T extends keyof Omit<M, "uuid">>(
				field: T,
				value: M[T],
			): string {
				return JSON.stringify({
					superjson: superjson.serialize(
						this._validateValue(field, value),
					),
				});
			},
			_validateField<T extends keyof Omit<M, "uuid">>(field: T): string {
				const parsedField = field.toString();
				if (!Object.keys(model.shape).includes(parsedField))
					throw new Error("[_arrayField] Invalider Schlüsselzugriff");
				return parsedField;
			},
			_validateModel(_model: M): M {
				return model.parse(_model) as M;
			},
			_validateUUID(uuid: M["uuid"]): M["uuid"] {
				return UUID.parse(uuid);
			},
			_validateValue<T extends keyof Omit<M, "uuid">>(
				field: T,
				value: M[T],
			): M[T] {
				return model.shape[field].parse(value) as M[T];
			},
			async create(data: Omit<M, "uuid">): Promise<M> {
				const uuid = crypto.randomUUID();
				await Promise.all(
					entries(data).map(([field, value]) =>
						ctx.put(
							this._constructKey(uuid, field),
							this._constructValue(field, value),
						),
					),
				);
				return this._validateModel({ ...data, uuid } as M);
			},
			async get<
				T extends keyof Omit<M, "uuid">,
				O extends Pick<KVNamespaceGetOptions<"json">, "cacheTtl"> & {
					required?: boolean;
				},
			>(
				uuid: M["uuid"],
				field: T,
				options?: O,
			): Promise<
				O extends { required: false } ? M[T] | undefined : M[T]
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
				if (!value?.superjson) {
					if (required)
						throw new Error("[_handler] Unerwarteter Feldwert");
					return undefined as O extends { required: false }
						? M[T] | undefined
						: M[T];
				}

				return this._validateValue(
					field,
					superjson.deserialize(value.superjson),
				);
			},
			async getMany<
				T extends keyof Omit<M, "uuid">,
				O extends Pick<KVNamespaceGetOptions<"json">, "cacheTtl"> & {
					required?: boolean;
				},
			>(
				uuid: M["uuid"],
				fields: T[],
				options?: O,
			): Promise<{
				[field in typeof fields[number]]: O extends { required: false }
					? M[field] | undefined
					: M[field];
			}> {
				return fromEntries<{
					[field in typeof fields[number]]: O extends {
						required: false;
					}
						? M[field] | undefined
						: M[field];
				}>(
					await Promise.all(
						fields.map(async (field) => [
							field,
							await this.get(uuid, field, options),
						]),
					),
				);
			},
			async list<
				T extends keyof Omit<M, "uuid">,
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
				T extends keyof Omit<M, "uuid">,
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
			async update({ uuid, ...data }: PartialExcept<M, "uuid">) {
				await Promise.all(
					entries(data).map(([field, value]) =>
						ctx.put(
							this._constructKey(uuid, field),
							this._constructValue(
								field,
								value as M[typeof field] /* TS sucks */,
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
