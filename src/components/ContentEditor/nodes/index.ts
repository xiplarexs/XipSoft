import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { ImageNode } from "./ImageNode";
import { HorizontalRuleNode } from "./HorizontalRuleNode";
import type { Klass, LexicalNode } from "lexical";

export const editorNodes: Klass<LexicalNode>[] = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  CodeNode,
  CodeHighlightNode,
  LinkNode,
  AutoLinkNode,
  ImageNode,
  HorizontalRuleNode,
];

export {
  ImageNode,
  $createImageNode,
  $isImageNode,
} from "./ImageNode";

export {
  HorizontalRuleNode,
  $createHorizontalRuleNode,
  $isHorizontalRuleNode,
} from "./HorizontalRuleNode";
