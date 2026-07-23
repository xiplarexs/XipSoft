import type { LexicalBlockNode, LexicalEditorState } from './types';
import { makeText, makeParagraph } from './node-builders';
import { parseHTML } from './html-parser';
import type { InlineChild } from './inline-converter';
import { convertBlock } from './block-converter';

export type { LexicalEditorState } from './types';
export { htmlToMarkdown } from './markdown-converter';

function htmlToLexical(html: string): LexicalEditorState {
  if (!html || !html.trim()) {
    return {
      root: {
        type: 'root',
        children: [makeParagraph([makeText('')])],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    };
  }

  const isHTML = /<[a-z][\s\S]*>/i.test(html);

  if (!isHTML) {
    const paragraphs = html.split(/\n{2,}/).map(s => s.trim()).filter(Boolean);
    const children: LexicalBlockNode[] = paragraphs.map(text => {
      const lines = text.split('\n');
      const inlines: InlineChild[] = [];
      lines.forEach((line, idx) => {
        if (line) inlines.push(makeText(line));
        if (idx < lines.length - 1) inlines.push({ type: 'linebreak', version: 1 });
      });
      return makeParagraph(inlines);
    });

    return {
      root: {
        type: 'root',
        children: children.length > 0 ? children : [makeParagraph([makeText(html.trim())])],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    };
  }

  const parsed = parseHTML(html);
  const blocks = convertBlock(parsed);

  const children: LexicalBlockNode[] = blocks.length > 0
    ? blocks
    : [makeParagraph([makeText(html.replace(/<[^>]+>/g, '').trim())])];

  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  };
}

export function contentToLexical(content: string): LexicalEditorState {
  return htmlToLexical(content);
}
