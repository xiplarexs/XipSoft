"use client";

import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  createCommand,
  COMMAND_PRIORITY_EDITOR,
  $insertNodes,
  $createParagraphNode,
  type LexicalCommand,
} from "lexical";
import { $createImageNode } from "../nodes/ImageNode";

export const INSERT_IMAgE_COMMAND: LexicalCommand<{
  src: string;
  altText: string;
  width?: number;
  height?: number;
}> = createCommand("INSERT_IMAgE_COMMAND");

export default function ImagePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INSERT_IMAgE_COMMAND,
      (payload) => {
        editor.update(() => {
          const imageNode = $createImageNode(payload);
          $insertNodes([imageNode]);
          const paragraph = $createParagraphNode();
          imageNode.insertAfter(paragraph);
          paragraph.select();
        });
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
