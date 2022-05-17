import { keys } from "~lib/util";

export const catchMessage = (
	status: number,
	mappings?: Record<string, string>,
) => {
	const messages: Record<string, string> = {
		401: "Die Authentifizierung ist für den Zugriff fehlgeschlagen 😳",
		404: "Wir haben überall gesucht 👉👈🥺",
		...mappings,
	};

	return (
		(keys(messages).includes(status.toString()) &&
			messages[status.toString()]) ||
		"Unbekannter Fehler - Bei wiederholtem, unvorhergesehenen Auftreten bitte melden 🤯"
	);
};
