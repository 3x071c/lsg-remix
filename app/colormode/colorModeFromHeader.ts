import { storageKey } from "@chakra-ui/react";
import { parseCookie } from "~app/util";

export default (cookieHeader: string) => parseCookie(cookieHeader, storageKey);
