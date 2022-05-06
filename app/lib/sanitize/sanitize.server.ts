import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

export const serverPurifier = () =>
	DOMPurify(new JSDOM("<!DOCTYPE html>").window as unknown as Window);
