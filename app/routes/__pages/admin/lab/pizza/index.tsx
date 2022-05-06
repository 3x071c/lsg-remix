import type { LoaderFunction } from "remix";
import {
	Heading,
	Flex,
	Stat,
	StatLabel,
	StatNumber,
	Center,
} from "@chakra-ui/react";
import type { Pizza } from "~models";
import { authorize } from "~feat/auth";
import { respond, useLoaderResponse } from "~lib/response";
import { prisma } from "~feat/prisma";

type LoaderData = {
	userId: number;
	status: number;
	pizzas: Pizza[];
};

const getLoaderData = async (request: Request): Promise<LoaderData> => {
	const { id } = await authorize(request, { lab: true });
	const pizzas = await prisma.pizza.findMany();

	return {
		pizzas,
		status: 200,
		userId: id,
	};
};

export const loader: LoaderFunction = async ({ request }) =>
	respond<LoaderData>(await getLoaderData(request));

export default function Index(): JSX.Element {
	const { pizzas } = useLoaderResponse<LoaderData>();

	return (
		<>
			<Heading>Pizza</Heading>
			<Center>
				<Flex mt={8} wrap="wrap" gap={8}>
					{pizzas.map((pizza) => (
						<Stat
							w="max-content"
							_hover={{ boxShadow: "lg", cursor: "pointer" }}
							p={4}
							borderWidth="2px"
							borderRadius="lg">
							<StatLabel>{pizza.name}</StatLabel>
							<StatNumber>{pizza.price} €</StatNumber>
						</Stat>
					))}
				</Flex>
			</Center>
		</>
	);
}
