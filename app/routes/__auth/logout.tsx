import type { LoaderFunction } from "remix";
import { invalidate } from "~feat/auth";

export const loader: LoaderFunction = async ({ request }) => {
	throw await invalidate(request);
};
