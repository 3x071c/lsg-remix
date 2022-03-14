import { createContext } from "react";

export type RemountContextData = {
	setData: (key: string, value: unknown) => void;
	data: {
		[key: string]: unknown;
	};
};
const RemountContext = createContext<RemountContextData>({
	data: {},
	setData: () => {},
});
export default RemountContext;
