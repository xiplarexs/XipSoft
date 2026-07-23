"use client";

import { MarkdownShortcutPlugin as LexicalMarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS, type ElementTransformer } from "@lexical/markdown";
import { $createParagraphNode } from "lexical";
import {
  HorizontalRuleNode,
  $createHorizontalRuleNode,
  $isHorizontalRuleNode,
} from "../nodes/HorizontalRuleNode";

const HR_TRANSFORMER: ElementTransformer = {
  dependencies: [HorizontalRuleNode],
  export: (node) => {
    if ($isHorizontalRuleNode(node)) {
      return "---";
    }
    return null;
  },
  regExp: /^(---|___|\*\*\*)\s/,
  replace: (parentNode) => {
    const hrNode = $createHorizontalRuleNode();
    const paragraphNode = $createParagraphNode();
    parentNode.replace(hrNode);
    hrNode.insertAfter(paragraphNode);
    paragraphNode.selectEnd();
  },
  type: "element",
};

const ALL_TRANSFORMERS = [...TRANSFORMERS, HR_TRANSFORMER];

export default function MarkdownShortcutPlugin() {
  return <LexicalMarkdownShortcutPlugin transformers={ALL_TRANSFORMERS} />;
}
