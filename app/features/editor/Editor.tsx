import { Prose } from "@nikolovlazar/chakra-ui-prose";
import { useEditor, EditorContent } from "@tiptap/react";
import { extensions, EditorBar } from ".";

export function Editor({ html }: { html: string }): JSX.Element {
	const editor = useEditor({
		content: html,
		extensions,
	});

	return (
		<>
			{editor && <EditorBar editor={editor} />}
			<Prose as="section">
				<EditorContent editor={editor} />
			</Prose>
		</>
	);
}
