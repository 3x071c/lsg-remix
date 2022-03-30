/* eslint-disable @typescript-eslint/no-redeclare -- Make Zod typings usable */

import { z } from "zod";

export const UUID = z
	.string({
		description: "Eine 128-bit einzigartige Kennung",
		invalid_type_error: "UUID muss eine Zeichenkette sein",
		required_error: "UUID ist erforderlich",
	})
	.uuid({ message: "UUID muss valide sein" });
export type UUID = z.infer<typeof UUID>;

export const DID = z.string({
	description: "Eine einzigartige Nutzerkennung (Decentralized ID)",
	invalid_type_error: "DID muss eine Zeichenkette sein",
	required_error: "DID ist erforderlich",
});
export type DID = z.infer<typeof DID>;

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
export type Name = z.infer<typeof Name>;

export const Boolean = z.boolean();
export type Boolean = z.infer<typeof Boolean>;
