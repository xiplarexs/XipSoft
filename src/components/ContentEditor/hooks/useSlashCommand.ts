"use client";

import { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  $createParagraphNode,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_UP_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  COMMAND_PRIORITY_HIGH,
  type LexicalEditor,
} from "lexical";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $createCodeNode } from "@lexical/code";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { $createHorizontalRuleNode } from "../nodes/HorizontalRuleNode";

export interface SlashCommandItem {
  title: string;
  description: string;
  icon: string;
  command: (editor: LexicalEditor) => void;
}

export const SLASH_COMMANDS: SlashCommandItem[] = [
  {
    title: "Heading 1",
    description: "Large heading",
    icon: "H1",
    command: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const node = selection.anchor.getNode();
          const element = node.getTopLevelElementOrThrow();
          const heading = $createHeadingNode("h1");
          element.replace(heading);
          heading.select();
        }
      });
    },
  },
  {
    title: "Heading 2",
    description: "Medium heading",
    icon: "H2",
    command: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const node = selection.anchor.getNode();
          const element = node.getTopLevelElementOrThrow();
          const heading = $createHeadingNode("h2");
          element.replace(heading);
          heading.select();
        }
      });
    },
  },
  {
    title: "Heading 3",
    description: "Small heading",
    icon: "H3",
    command: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const node = selection.anchor.getNode();
          const element = node.getTopLevelElementOrThrow();
          const heading = $createHeadingNode("h3");
          element.replace(heading);
          heading.select();
        }
      });
    },
  },
  {
    title: "Bullet List",
    description: "Unordered list",
    icon: "\u2022",
    command: (editor) => {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    },
  },
  {
    title: "Numbered List",
    description: "Ordered list",
    icon: "1.",
    command: (editor) => {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    },
  },
  {
    title: "Quote",
    description: "Blockquote",
    icon: "\u201C",
    command: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const node = selection.anchor.getNode();
          const element = node.getTopLevelElementOrThrow();
          const quote = $createQuoteNode();
          element.replace(quote);
          quote.select();
        }
      });
    },
  },
  {
    title: "Code Block",
    description: "Code with syntax highlighting",
    icon: "</>",
    command: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const node = selection.anchor.getNode();
          const element = node.getTopLevelElementOrThrow();
          const code = $createCodeNode();
          element.replace(code);
          code.select();
        }
      });
    },
  },
  {
    title: "Divider",
    description: "Horizontal rule",
    icon: "\u2014",
    command: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const node = selection.anchor.getNode();
          const element = node.getTopLevelElementOrThrow();
          const hr = $createHorizontalRuleNode();
          element.replace(hr);
          const paragraph = $createParagraphNode();
          hr.insertAfter(paragraph);
          paragraph.select();
        }
      });
    },
  },
  {
    title: "Image",
    description: "Insert image from URL",
    icon: "IMg",
    command: () => {
      // Handled by SlashCommandPlugin which opens the image dialog
    },
  },
];

interface Position {
  top: number;
  left: number;
}

export function useSlashCommand() {
  const [editor] = useLexicalComposerContext();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredCommands = SLASH_COMMANDS.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(query.toLowerCase()) ||
      cmd.description.toLowerCase().includes(query.toLowerCase())
  );

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const executeCommand = useCallback(
    (item: SlashCommandItem) => {
      // Remove the slash and query text first
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

      item.command(editor);
      closeMenu();
    },
    [editor, closeMenu]
  );

  // Listen for text changes to detect slash commands
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
          if (isOpen) closeMenu();
          return;
        }

        const node = selection.anchor.getNode();
        const text = node.getTextContent();
        const offset = selection.anchor.offset;

        if (text.startsWith("/") && offset > 0) {
          const queryText = text.slice(1, offset);
          setQuery(queryText);
          setSelectedIndex(0);

          if (!isOpen) {
            const nativeSelection = window.getSelection();
            if (nativeSelection && nativeSelection.rangeCount > 0) {
              const range = nativeSelection.getRangeAt(0);
              const rect = range.getBoundingClientRect();
              setPosition({
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX,
              });
            }
            setIsOpen(true);
          }
        } else if (isOpen) {
          closeMenu();
        }
      });
    });
  }, [editor, isOpen, closeMenu]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const removeDown = editor.registerCommand(
      KEY_ARROW_DOWN_COMMAND,
      (event) => {
        event.preventDefault();
        setSelectedIndex((prev) =>
          filteredCommands.length > 0
            ? (prev + 1) % filteredCommands.length
            : 0
        );
        return true;
      },
      COMMAND_PRIORITY_HIgH
    );

    const removeUp = editor.registerCommand(
      KEY_ARROW_UP_COMMAND,
      (event) => {
        event.preventDefault();
        setSelectedIndex((prev) =>
          filteredCommands.length > 0
            ? (prev - 1 + filteredCommands.length) % filteredCommands.length
            : 0
        );
        return true;
      },
      COMMAND_PRIORITY_HIgH
    );

    const removeEnter = editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        if (filteredCommands.length > 0) {
          event?.preventDefault();
          const cmd = filteredCommands[selectedIndex];
          if (cmd) executeCommand(cmd);
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_HIgH
    );

    const removeEscape = editor.registerCommand(
      KEY_ESCAPE_COMMAND,
      () => {
        closeMenu();
        return true;
      },
      COMMAND_PRIORITY_HIgH
    );

    return () => {
      removeDown();
      removeUp();
      removeEnter();
      removeEscape();
    };
  }, [editor, isOpen, filteredCommands, selectedIndex, executeCommand, closeMenu]);

  return {
    isOpen,
    position,
    query,
    selectedIndex,
    filteredCommands,
    executeCommand,
    closeMenu,
  };
}
