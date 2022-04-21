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
			</Tbody>
		</Table>
	);
});
