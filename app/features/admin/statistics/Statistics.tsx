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
		<StatGroup
			mt={8}
			borderWidth="1px"
			borderRadius="2xl"
			textAlign="center">
			<Stat borderRightWidth="1px">
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
