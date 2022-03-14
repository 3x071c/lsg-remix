import { useRef, useEffect, useContext, DependencyList } from "react";
import RemountContext from "./RemountContext";

const useOnRemount = (
	fn: (remountData: unknown) => void,
	inputs: DependencyList,
	key: string,
) => {
	const remountContext = useContext(RemountContext);
	const remountMetaKey = `${key}-meta`;
	const remountMetaRef = useRef(remountContext.data[remountMetaKey]);
	const remountDataKey = `${key}-data`;
	const remountDataRef = useRef(remountContext.data[remountDataKey]);

	useEffect(() => {
		if (remountMetaRef.current !== undefined)
			remountDataRef.current = fn(remountDataRef.current);
		remountMetaRef.current = true;
		remountContext.setData(remountMetaKey, remountMetaRef.current);
		remountContext.setData(remountDataKey, remountDataRef.current);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, inputs);
};
export default useOnRemount;
