import type { Editor } from "@tiptap/react";
import {
	IconButton,
	ButtonGroup,
	Tooltip,
	Icon,
	chakra,
} from "@chakra-ui/react";
import {
	BiBold,
	BiDotsHorizontalRounded,
	BiEraser,
	BiHeading,
	BiItalic,
	BiListOl,
	BiListUl,
	BiParagraph,
	BiRedo,
	BiRightIndent,
	BiStrikethrough,
	BiSubdirectoryLeft,
	BiTrash,
	BiUndo,
} from "react-icons/bi";
import { headingLevels } from ".";

export function EditorBar({ editor }: { editor: Editor }): JSX.Element {
	return (
		<>
			<ButtonGroup size="md" variant="ghost" isAttached>
				<Tooltip label="Formattierung">
					<IconButton
						variant="outline"
						mr="-px"
						aria-label="Formattierung entfernen"
						icon={<Icon as={BiEraser} />}
						onClick={() =>
							editor.chain().focus().unsetAllMarks().run()
						}
					/>
				</Tooltip>
				<Tooltip label="Struktur">
					<IconButton
						variant="outline"
						mr="-px"
						aria-label="Struktur entfernen"
						icon={<Icon as={BiTrash} />}
						onClick={() =>
							editor.chain().focus().clearNodes().run()
						}
					/>
				</Tooltip>
			</ButtonGroup>
			<ButtonGroup size="md" variant="ghost" isAttached>
				<Tooltip label="Paragraph">
					<IconButton
						mr="-px"
						variant={
							editor.isActive("paragraph") ? "solid" : "ghost"
						}
						aria-label="Paragraph setzen"
						icon={<Icon as={BiParagraph} />}
						onClick={() =>
							editor.chain().focus().setParagraph().run()
						}
					/>
				</Tooltip>
				{headingLevels.map((level) => (
					<Tooltip label={`Überschrift ${level}`} key={level}>
						<IconButton
							mr="-px"
							variant={
								editor.isActive("heading", { level })
									? "solid"
									: "ghost"
							}
							aria-label={`Überschrift ${level} setzen`}
							icon={
								<>
									<Icon as={BiHeading} />
									<chakra.sub>{level}</chakra.sub>
								</>
							}
							onClick={() =>
								editor
									.chain()
									.focus()
									.toggleHeading({ level })
									.run()
							}
						/>
					</Tooltip>
				))}
				<Tooltip label="Stichpunkte">
					<IconButton
						mr="-px"
						variant={
							editor.isActive("bulletList") ? "solid" : "ghost"
						}
						aria-label="Stickpunkte setzen"
						icon={<Icon as={BiListUl} />}
						onClick={() =>
							editor.chain().focus().toggleBulletList().run()
						}
					/>
				</Tooltip>
				<Tooltip label="Liste">
					<IconButton
						mr="-px"
						variant={
							editor.isActive("orderedList") ? "solid" : "ghost"
						}
						aria-label="Liste setzen"
						icon={<Icon as={BiListOl} />}
						onClick={() =>
							editor.chain().focus().toggleOrderedList().run()
						}
					/>
				</Tooltip>
				<Tooltip label="Zitat">
					<IconButton
						mr="-px"
						variant={
							editor.isActive("blockquote") ? "solid" : "ghost"
						}
						aria-label="Zitat setzen"
						icon={<Icon as={BiRightIndent} />}
						onClick={() =>
							editor.chain().focus().toggleBlockquote().run()
						}
					/>
				</Tooltip>
				<Tooltip label="Abschnitt">
					<IconButton
						mr="-px"
						aria-label="Abschnitt setzen"
						icon={<Icon as={BiDotsHorizontalRounded} />}
						onClick={() =>
							editor.chain().focus().setHorizontalRule().run()
						}
					/>
				</Tooltip>
				<Tooltip label="Umbruch">
					<IconButton
						mr="-px"
						aria-label="Umbruch setzen"
						icon={<Icon as={BiSubdirectoryLeft} />}
						onClick={() =>
							editor.chain().focus().setHardBreak().run()
						}
					/>
				</Tooltip>
			</ButtonGroup>
			<ButtonGroup size="md" variant="ghost" isAttached>
				<Tooltip label="Fett">
					<IconButton
						mr="-px"
						variant={editor.isActive("bold") ? "solid" : "ghost"}
						aria-label="Fett setzen"
						icon={<Icon as={BiBold} />}
						onClick={() =>
							editor.chain().focus().toggleBold().run()
						}
					/>
				</Tooltip>
				<Tooltip label="Kursiv">
					<IconButton
						mr="-px"
						variant={editor.isActive("italic") ? "solid" : "ghost"}
						aria-label="Kursiv setzen"
						icon={<Icon as={BiItalic} />}
						onClick={() =>
							editor.chain().focus().toggleItalic().run()
						}
					/>
				</Tooltip>
				<Tooltip label="Durchstreichen">
					<IconButton
						mr="-px"
						variant={editor.isActive("strike") ? "solid" : "ghost"}
						aria-label="Durchgestrichen setzen"
						icon={<Icon as={BiStrikethrough} />}
						onClick={() =>
							editor.chain().focus().toggleStrike().run()
						}
					/>
				</Tooltip>
			</ButtonGroup>
			<ButtonGroup size="md" variant="ghost" isAttached>
				<Tooltip label="Rückgängig">
					<IconButton
						variant="outline"
						mr="-px"
						aria-label="Rückgängig machen"
						icon={<Icon as={BiUndo} />}
						onClick={() => editor.chain().focus().undo().run()}
					/>
				</Tooltip>
				<Tooltip label="Wiederholen">
					<IconButton
						variant="outline"
						mr="-px"
						aria-label="Wiederholen"
						icon={<Icon as={BiRedo} />}
						onClick={() => editor.chain().focus().redo().run()}
					/>
				</Tooltip>
			</ButtonGroup>
		</>
	);
}
