import { Input } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useState } from "react";
import { useAsyncDebounce } from "react-table";
import { preGlobalFilteredRowsAtom, globalFilterAtom } from "./PageTable";

export function FilterInput(): JSX.Element {
	const [preGlobalFilteredRows] = useAtom(preGlobalFilteredRowsAtom);
	const [globalFilter, setGlobalFilter] = useAtom(globalFilterAtom);

	const count = preGlobalFilteredRows.length;
	const [value, setValue] = useState(globalFilter);
	const onChange = useAsyncDebounce((v) => {
		setGlobalFilter(v || undefined);
	}, 200);

	return (
		<Input
			value={value ? String(value) : ""}
			placeholder={`🔍 Filtern (${count})`}
			onChange={(e) => {
				setValue(e.target.value);
				onChange(e.target.value);
			}}
		/>
	);
}
