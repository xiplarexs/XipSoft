import type {
  LexicalTextNode,
  LexicalParagraphNode,
  LexicalHeadingNode,
  LexicalQuoteNode,
  LexicalListNode,
  LexicalListItemNode,
  LexicalCodeNode,
  LexicalLinkNode,
  LexicalImageNode,
  LexicalHorizontalRuleNode,
} from './types';

export const FORMAT_BOLD        = 1;
export const FORMAT_ITALIC      = 2;
export const FORMAT_STRIKETHROUgH = 4;
export const FORMAT_UNDERLINE   = 8;
export const FORMAT_CODE        = 16;
// export const FORMAT_SUBSCRIPT   = 32;
// export const FORMAT_SUPERSCRIPT = 64;

export function makeText(text: string, format = 0): LexicalTextNode {
  return { type: 'text', text, format, detail: 0, mode: 'normal', style: '', version: 1 };
}

export function makeParagraph(children: LexicalParagraphNode['children'] = []): LexicalParagraphNode {
  return { type: 'paragraph', children, direction: 'ltr', format: '', indent: 0, version: 1 };
}

export function makeHeading(tag: LexicalHeadingNode['tag'], children: LexicalHeadingNode['children'] = []): LexicalHeadingNode {
  return { type: 'heading', tag, children, direction: 'ltr', format: '', indent: 0, version: 1 };
}

export function makeQuote(children: LexicalQuoteNode['children'] = []): LexicalQuoteNode {
  return { type: 'quote', children, direction: 'ltr', format: '', indent: 0, version: 1 };
}

export function makeList(listType: 'bullet' | 'number', children: LexicalListItemNode[] = []): LexicalListNode {
  return {
    type: 'list',
    listType,
    tag: listType === 'bullet' ? 'ul' : 'ol',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    start: 1,
    version: 1,
  };
}

export function makeListItem(children: LexicalListItemNode['children'] = [], value = 1): LexicalListItemNode {
  return { type: 'listitem', children, direction: 'ltr', format: '', indent: 0, value, version: 1 };
}

export function makeCode(children: LexicalTextNode[] = [], language = ''): LexicalCodeNode {
  return { type: 'code', children, direction: 'ltr', format: '', indent: 0, language, version: 1 };
}

export function makeLink(url: string, children: LexicalTextNode[] = [], title?: string): LexicalLinkNode {
  return {
    type: 'link',
    url,
    target: '_blank',
    rel: 'noopener noreferrer',
    title: title ?? null,
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  };
}

export function makeImage(src: string, alt = ''): LexicalImageNode {
  return {
    type: 'image',
    src,
    altText: alt,
    maxWidth: 800,
    showCaption: false,
    version: 1,
  };
}

export function makeHR(): LexicalHorizontalRuleNode {
  return { type: 'horizontalrule', version: 1 };
}
