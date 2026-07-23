"use client";

import { useState, useCallback } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useSlashCommand } from "../hooks/useSlashCommand";
import SlashCommandMenu from "../ui/SlashCommandMenu";
import ImageInsertDialog from "../ui/ImageInsertDialog";
import { $createImageNode } from "../nodes/ImageNode";
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  $insertNodes,
  $createParagraphNode,
} from "lexical";

export default function SlashCommandPlugin() {
  const [editor] = useLexicalComposerContext();
  const {
    isOpen,
    position,
    selectedIndex,
    filteredCommands,
    executeCommand,
  } = useSlashCommand();

  const [showImageDialog, setShowImageDialog] = useState(false);

  const handleSelect = useCallback(
    (item: (typeof filteredCommands)[number]) => {
      if (item.title === "Image") {
        // Remove the slash text first
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const node = selection.anchor.getNode();
            if ($isTextNode(node)) {
              const text = node.getTextContent();
              if (text.startsWith("/")) {
                node.setTextContent("");
              }
            }
          }
        });
        setShowImageDialog(true);
      } else {
        executeCommand(item);
      }
    },
    [editor, executeCommand]
  );

  const handleImageInsert = useCallback(
    (src: string, altText: string) => {
      editor.update(() => {
        const imageNode = $createImageNode({ src, altText });
        $insertNodes([imageNode]);
        // Add a paragraph after for continued editing
        const paragraph = $createParagraphNode();
        imageNode.insertAfter(paragraph);
        paragraph.select();
      });
    },
    [editor]
  );

  return (
    <>
      <SlashCommandMenu
        isOpen={isOpen}
        position={position}
        selectedIndex={selectedIndex}
        filteredCommands={filteredCommands}
        onSelect={handleSelect}
      />
      <ImageInsertDialog
        isOpen={showImageDialog}
        onClose={() => setShowImageDialog(false)}
        onInsert={handleImageInsert}
      />
    </>
  );
}
