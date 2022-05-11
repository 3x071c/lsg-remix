import type { Level } from "@tiptap/extension-heading";
import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import CharacterCount from "@tiptap/extension-character-count";
import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import History from "@tiptap/extension-history";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";

export const headingLevels = Array.from(
	{ length: 3 },
	(_, i) => i + 2,
) as Level[];

export const extensions = [
	// NODES
	Document,
	Text,
	Paragraph.configure({
		HTMLAttributes: {
			class: "tt-paragraph",
		},
	}),
	Heading.configure({
		HTMLAttributes: {
			class: "tt-heading",
		},
		levels: headingLevels,
	}),
	ListItem.configure({
		HTMLAttributes: {
			class: "tt-li",
		},
	}),
	BulletList.configure({
		HTMLAttributes: {
			class: "tt-bl",
		},
	}),
	OrderedList.configure({
		HTMLAttributes: {
			class: "tt-ol",
		},
	}),
	HorizontalRule.configure({
		HTMLAttributes: {
			class: "tt-hr",
		},
	}),
	HardBreak.configure({
		HTMLAttributes: {
			class: "tt-hb",
		},
		keepMarks: false,
	}),
	Blockquote.configure({
		HTMLAttributes: {
			class: "tt-bq",
		},
	}),
	// MARKS
	Bold.configure({
		HTMLAttributes: {
			class: "tt-bold",
		},
	}),
	Highlight.configure({
		HTMLAttributes: {
			class: "tt-highlight",
		},
	}), // NOT IMPLEMENTED!
	Italic.configure({
		HTMLAttributes: {
			class: "tt-italic",
		},
	}),
	Link.configure({
		HTMLAttributes: {
			class: "tt-link",
		},
	}), // NOT IMPLEMENTED!
	Strike.configure({
		HTMLAttributes: {
			class: "tt-strike",
		},
	}),
	Underline.configure({
		HTMLAttributes: {
			class: "tt-underline",
		},
	}), // NOT IMPLEMENTED!
	// EXTENSIONS
	CharacterCount.configure({
		limit: 10000,
	}), // NOT IMPLEMENTED!
	Dropcursor.configure({
		class: "tt-dropcursor",
		color: "red",
	}),
	Gapcursor,
	History.configure({
		newGroupDelay: 2000,
	}),
	Placeholder.configure({
		emptyEditorClass: "tt-editor-empty",
		emptyNodeClass: "tt-node-empty",
		placeholder: "My Custom Placeholder",
	}),
	Typography,
];
