import {
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	StatGroup,
} from "@chakra-ui/react";
import { keys } from "~lib/util";

export type StatisticsProps = {
	data: {
		updatedAt: Date;
		createdAt: Date;
		categoryUUID: string;
		title: string;
	}[];
};
export function Statistics({ data }: StatisticsProps): JSX.Element {
	return (
		<StatGroup mt={8} textAlign="center" borderWidth={1} borderRadius="2xl">
			<Stat borderRightWidth={1}>
				<StatLabel>Seiten</StatLabel>
				<StatNumber>{keys(data).length}</StatNumber>
				<StatHelpText>Anzahl</StatHelpText>
			</Stat>

			<Stat>
				<StatLabel>Status</StatLabel>
				<StatNumber>OK</StatNumber>
				<StatHelpText>Operational</StatHelpText>
			</Stat>
		</StatGroup>
	);
}
