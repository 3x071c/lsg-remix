import { PropsWithChildren, useMemo, useState } from "react";
import RemountContext from "./RemountContext";

export default function RemountProvider({
	children,
}: PropsWithChildren<unknown>) {
	const [data, setDataRaw] = useState({});
	const setData = (key: string, value: unknown) =>
		setDataRaw((oldData) => {
			return {
				...oldData,
				[key]: value,
			};
		});

	return (
		<RemountContext.Provider
			value={useMemo(() => ({ data, setData }), [data])}>
			{children}
		</RemountContext.Provider>
	);
}
