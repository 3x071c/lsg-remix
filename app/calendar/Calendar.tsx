import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

import { memo } from "react";

export default memo(function Awards() {
	return (
		<Table>
			<Thead>
				<Tr>
					<Th>Datum</Th>
					<Th>Uhrzeit</Th>
					<Th>Ort</Th>
					<Th>Beschreibung</Th>
				</Tr>
			</Thead>
			<Tbody>
				<Tr>
					<Td>20.09.</Td>
					<Td />
					<Td />
					<Td>
						Buch-Gutschein-Aktion &quot;Ich schenke dir eine
						Geschichte&quot; zum Welttag des Buches
					</Td>
				</Tr>
				<Tr>
					<Td>22.09.</Td>
					<Td>19:00</Td>
					<Td>Kla.Zi.</Td>
					<Td>08. Jgst.: Klassenelternversammlung</Td>
				</Tr>
				<Tr>
					<Td>23.09.</Td>
					<Td>08:45 - 09:30</Td>
					<Td>Mensa</Td>
					<Td>
						Q12: Vollversammlung: Wahl der Jahrgangsstufensprecher
					</Td>
				</Tr>
				<Tr>
					<Td>24.09.</Td>
					<Td>19:00</Td>
					<Td>Kla.Zi.</Td>
					<Td>09. Jgst.: Klassenelternversammlung</Td>
				</Tr>
				<Tr>
					<Td>29.09.</Td>
					<Td>08:00 - 08:45</Td>
					<Td>Mensa</Td>
					<Td>
						Q12: Vollversammlung: Wahl der Jahrgangsstufensprecher
					</Td>
				</Tr>
				<Tr>
					<Td>29.09.</Td>
					<Td>19:00</Td>
					<Td>Kla.Zi.</Td>
					<Td>10. Jgst.: Klassenelternversammlung</Td>
				</Tr>
			</Tbody>
		</Table>
	);
});
