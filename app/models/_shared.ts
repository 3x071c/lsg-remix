/* eslint-disable @typescript-eslint/no-redeclare -- Make Zod typings usable */

import { z } from "zod";

export const Email = z
	.string({
		description: "E-Mail-Adresse",
		invalid_type_error: "E-Mail-Adresse muss eine Zeichenkette sein",
		required_error: "E-Mail-Adresse ist erforderlich",
	})
	.email({ message: "E-Mail muss valide sein" });
export type Email = z.infer<typeof Email>;

export const Firstname = z
	.string({
		description: "Vorname",
		invalid_type_error: "Vorname muss eine Zeichenkette sein",
		required_error: "Vorname ist erforderlich",
	})
	.min(3, { message: "Vorname muss valide sein" })
	.max(20, { message: "Vorname muss valide sein" });
export type Firstname = z.infer<typeof Firstname>;

export const Lastname = z
	.string({
		description: "Nachname",
		invalid_type_error: "Nachname muss eine Zeichenkette sein",
		required_error: "Nachname ist erforderlich",
	})
	.min(3, { message: "Nachname muss valide sein" })
	.max(20, { message: "Nachname muss valide sein" });
export type Lastname = z.infer<typeof Lastname>;

export const Password = z
	.string({
		description: "Passwort",
		invalid_type_error: "Passwort muss eine Zeichenkette sein",
		required_error: "Passwort ist erforderlich",
	})
	.min(8, { message: "Passwort muss mindestens 8 Zeichen haben" })
	.max(50, { message: "Passwort darf nicht länger als 50 Zeichen sein" })
	.regex(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
		{
			message:
				"Passwort muss aus mindestens einem Groß- und Kleinbuchstaben, einer Zahl und einem Sonderzeichen bestehen",
		},
	);
export type Password = z.infer<typeof Password>;

export const UUID = z
	.string({
		description: "Eine 128-bit einzigartige Kennung",
		invalid_type_error: "UUID muss eine Zeichenkette sein",
		required_error: "UUID ist erforderlich",
	})
	.length(32, {
		message: "UUID muss mindestens 32 Charaktere lang sein",
	})
	.uuid({ message: "UUID muss valide sein" });
export type UUID = z.infer<typeof UUID>;

export const Title = z
	.string({
		description: "Titel",
		invalid_type_error: "Titel muss eine Zeichenkette sein",
		required_error: "Titel ist erforderlich",
	})
	.min(3, { message: "Titel muss mindestens 3 Charaktere lang sein" })
	.max(15, { message: "Titel darf nicht länger als 15 Zeichen sein" });
export type Title = z.infer<typeof Title>;

export const Name = z
	.string({
		description: "Name",
		invalid_type_error: "Name muss eine Zeichenkette sein",
		required_error: "Name ist erforderlich",
	})
	.min(3, { message: "Name muss mindestens 3 Charaktere lang sein" })
	.max(15, { message: "Name darf nicht länger als 15 Zeichen sein" });
