export type LexicalTextFormat = 0 | 1 | 2 | 4 | 8 | 16 | 32 | 64;

export interface LexicalTextNode {
  type: 'text';
  text: string;
  format: number;
  detail: number;
  mode: 'normal' | 'token' | 'segmented';
  style: string;
  version: 1;
}

export interface LexicalLineBreakNode {
  type: 'linebreak';
  version: 1;
}

export interface LexicalParagraphNode {
  type: 'paragraph';
  children: (LexicalTextNode | LexicalLineBreakNode | LexicalLinkNode | LexicalImageNode)[];
  direction: 'ltr' | 'rtl' | null;
  format: '' | 'left' | 'center' | 'right' | 'justify';
  indent: number;
  version: 1;
}

export interface LexicalHeadingNode {
  type: 'heading';
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: (LexicalTextNode | LexicalLinkNode)[];
  direction: 'ltr' | 'rtl' | null;
  format: '';
  indent: number;
  version: 1;
}

export interface LexicalQuoteNode {
  type: 'quote';
  children: (LexicalTextNode | LexicalParagraphNode)[];
  direction: 'ltr' | 'rtl' | null;
  format: '';
  indent: number;
  version: 1;
}

export interface LexicalListItemNode {
  type: 'listitem';
  children: (LexicalTextNode | LexicalLinkNode | LexicalListNode)[];
  direction: 'ltr' | 'rtl' | null;
  format: '';
  indent: number;
  value: number;
  checked?: boolean;
  version: 1;
}

export interface LexicalListNode {
  type: 'list';
  listType: 'bullet' | 'number';
  tag: 'ul' | 'ol';
  children: LexicalListItemNode[];
  direction: 'ltr' | 'rtl' | null;
  format: '';
  indent: number;
  start: number;
  version: 1;
}

export interface LexicalCodeNode {
  type: 'code';
  children: LexicalTextNode[];
  direction: 'ltr' | 'rtl' | null;
  format: '';
  indent: number;
  language: string;
  version: 1;
}

export interface LexicalLinkNode {
  type: 'link';
  url: string;
  target: '_blank' | '_self' | null;
  rel: string | null;
  title: string | null;
  children: LexicalTextNode[];
  direction: 'ltr' | 'rtl' | null;
  format: '';
  indent: number;
  version: 1;
}

export interface LexicalImageNode {
  type: 'image';
  src: string;
  altText: string;
  width?: number;
  height?: number;
  maxWidth: number;
  showCaption: boolean;
  caption?: object;
  version: 1;
}

export interface LexicalHorizontalRuleNode {
  type: 'horizontalrule';
  version: 1;
}

export type LexicalBlockNode =
  | LexicalParagraphNode
  | LexicalHeadingNode
  | LexicalQuoteNode
  | LexicalListNode
  | LexicalCodeNode
  | LexicalHorizontalRuleNode
  | LexicalImageNode;

export interface LexicalRootNode {
  type: 'root';
  children: LexicalBlockNode[];
  direction: 'ltr' | 'rtl' | null;
  format: '';
  indent: number;
  version: 1;
}

export interface LexicalEditorState {
  root: LexicalRootNode;
}
