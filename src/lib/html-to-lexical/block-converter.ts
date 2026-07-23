import type { LexicalBlockNode, LexicalHeadingNode, LexicalParagraphNode, LexicalQuoteNode, LexicalListItemNode, LexicalTextNode } from './types';
import type { ParsedNode } from './html-parser';
import { makeText, makeParagraph, makeHeading, makeQuote, makeList, makeListItem, makeCode, makeImage, makeHR } from './node-builders';
import { convertInline, extractText } from './inline-converter';

export function convertBlock(nodes: ParsedNode[]): LexicalBlockNode[] {
  const blocks: LexicalBlockNode[] = [];

  for (const node of nodes) {
    if (node.type === 'text') {
      const text = (node.text ?? '').trim();
      if (!text) continue;
      blocks.push(makeParagraph([makeText(text)]));
      continue;
    }

    const tag = node.tag ?? '';
    const children = node.children ?? [];

    switch (tag) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6': {
        const inlines = convertInline(children) as LexicalHeadingNode['children'];
        if (inlines.length === 0) {
          const text = extractText(children).trim();
          if (text) inlines.push(makeText(text));
        }
        if (inlines.length > 0) {
          blocks.push(makeHeading(tag as LexicalHeadingNode['tag'], inlines));
        }
        break;
      }

      case 'p': {
        const inlines = convertInline(children);
        if (inlines.length > 0) {
          blocks.push(makeParagraph(inlines));
        } else {
          const text = extractText(children).trim();
          if (text) blocks.push(makeParagraph([makeText(text)]));
        }
        break;
      }

      case 'blockquote': {
        const innerBlocks = convertBlock(children);
        if (innerBlocks.length > 0) {
          const inlines: LexicalQuoteNode['children'] = [];
          for (const b of innerBlocks) {
            if (b.type === 'paragraph') {
              if (inlines.length > 0) inlines.push({ type: 'linebreak', version: 1 } as any);
              inlines.push(...(b as LexicalParagraphNode).children as any);
            }
          }
          if (inlines.length > 0) blocks.push(makeQuote(inlines));
        } else {
          const inlines = convertInline(children);
          if (inlines.length > 0) blocks.push(makeQuote(inlines as any));
        }
        break;
      }

      case 'ul':
      case 'ol': {
        const listType = tag === 'ul' ? 'bullet' : 'number';
        const items = convertListItems(children, listType);
        if (items.length > 0) blocks.push(makeList(listType, items));
        break;
      }

      case 'pre': {
        const codeEl = children.find(c => c.type === 'element' && c.tag === 'code');
        const rawText = codeEl
          ? extractText(codeEl.children ?? [])
          : extractText(children);
        const language = codeEl?.attrs?.class?.replace(/language-/, '') ?? '';
        const lines = rawText.split('\n');
        const codeChildren: LexicalTextNode[] = lines.map((line, idx) => {
          if (idx < lines.length - 1) {
            return [makeText(line), { type: 'linebreak', version: 1 } as any];
          }
          return [makeText(line)];
        }).flat();
        if (codeChildren.length > 0) blocks.push(makeCode(codeChildren, language));
        break;
      }

      case 'hr':
        blocks.push(makeHR());
        break;

      case 'img': {
        const src = node.attrs?.src ?? '';
        const alt = node.attrs?.alt ?? '';
        if (src) blocks.push(makeImage(src, alt));
        break;
      }

      case 'figure': {
        const imgEl = children.find(c => c.type === 'element' && c.tag === 'img');
        if (imgEl) {
          const src = imgEl.attrs?.src ?? '';
          const alt = imgEl.attrs?.alt ?? '';
          if (src) blocks.push(makeImage(src, alt));
        }
        const caption = children.find(c => c.type === 'element' && c.tag === 'figcaption');
        if (caption) {
          const text = extractText(caption.children ?? []).trim();
          if (text) blocks.push(makeParagraph([makeText(text)]));
        }
        break;
      }

      case 'table': {
        const cells = findAll(children, ['td', 'th']);
        for (const cell of cells) {
          const text = extractText(cell.children ?? []).trim();
          if (text) blocks.push(makeParagraph([makeText(text)]));
        }
        break;
      }

      case 'div':
      case 'section':
      case 'article':
      case 'main':
      case 'aside':
      case 'header':
      case 'footer':
      case 'nav':
      case 'details':
      case 'summary':
      case 'fieldset':
      case 'form':
        blocks.push(...convertBlock(children));
        break;

      case 'strong':
      case 'b':
      case 'em':
      case 'i':
      case 'u':
      case 's':
      case 'del':
      case 'span':
      case 'a':
      case 'code': {
        const inlines = convertInline([node]);
        if (inlines.length > 0) blocks.push(makeParagraph(inlines));
        break;
      }

      case 'br':
        blocks.push(makeParagraph());
        break;

      default:
        if (children.length > 0) {
          blocks.push(...convertBlock(children));
        }
        break;
    }
  }

  return blocks;
}

export function convertListItems(nodes: ParsedNode[], listType: 'bullet' | 'number'): LexicalListItemNode[] {
  const items: LexicalListItemNode[] = [];
  let value = 1;

  for (const node of nodes) {
    if (node.type !== 'element' || node.tag !== 'li') continue;
    const children = node.children ?? [];

    const nestedList = children.find(c => c.type === 'element' && (c.tag === 'ul' || c.tag === 'ol'));
    const inlineChildren = children.filter(c => !(c.type === 'element' && (c.tag === 'ul' || c.tag === 'ol')));

    const itemChildren: LexicalListItemNode['children'] = convertInline(inlineChildren) as any;

    if (nestedList) {
      const nestedType = nestedList.tag === 'ul' ? 'bullet' : 'number';
      const nestedItems = convertListItems(nestedList.children ?? [], nestedType);
      if (nestedItems.length > 0) {
        itemChildren.push(makeList(nestedType, nestedItems) as any);
      }
    }

    if (itemChildren.length === 0) {
      const text = extractText(children).trim();
      if (text) itemChildren.push(makeText(text));
    }

    if (itemChildren.length > 0) {
      items.push(makeListItem(itemChildren, value++));
    }
  }

  return items;
}

export function findAll(nodes: ParsedNode[], tags: string[]): ParsedNode[] {
  const result: ParsedNode[] = [];
  for (const node of nodes) {
    if (node.type === 'element' && tags.includes(node.tag ?? '')) {
      result.push(node);
    }
    if (node.children) result.push(...findAll(node.children, tags));
  }
  return result;
}
