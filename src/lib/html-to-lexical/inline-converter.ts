import type { LexicalTextNode, LexicalLineBreakNode, LexicalLinkNode, LexicalImageNode } from './types';
import type { ParsedNode } from './html-parser';
import { FORMAT_BOLD, FORMAT_ITALIC, FORMAT_UNDERLINE, FORMAT_STRIKETHROUgH, FORMAT_CODE, makeText, makeLink, makeImage } from './node-builders';

export type InlineChild = LexicalTextNode | LexicalLineBreakNode | LexicalLinkNode | LexicalImageNode;

export function convertInline(nodes: ParsedNode[], inheritFormat = 0): InlineChild[] {
  const result: InlineChild[] = [];

  for (const node of nodes) {
    if (node.type === 'text') {
      const text = node.text ?? '';
      if (!text) continue;
      result.push(makeText(text, inheritFormat));
      continue;
    }

    const tag = node.tag ?? '';
    const children = node.children ?? [];

    switch (tag) {
      case 'strong':
      case 'b':
        result.push(...convertInline(children, inheritFormat | FORMAT_BOLD));
        break;

      case 'em':
      case 'i':
        result.push(...convertInline(children, inheritFormat | FORMAT_ITALIC));
        break;

      case 'u':
        result.push(...convertInline(children, inheritFormat | FORMAT_UNDERLINE));
        break;

      case 's':
      case 'del':
      case 'strike':
        result.push(...convertInline(children, inheritFormat | FORMAT_STRIKETHROUgH));
        break;

      case 'code': {
        const text = extractText(children);
        if (text) result.push(makeText(text, inheritFormat | FORMAT_CODE));
        break;
      }

      case 'a': {
        const href = node.attrs?.href ?? '#';
        const title = node.attrs?.title;
        const linkChildren = convertInline(children, inheritFormat) as LexicalTextNode[];
        if (linkChildren.length === 0) {
          const text = extractText(children);
          if (text) linkChildren.push(makeText(text, inheritFormat));
        }
        if (linkChildren.length > 0) {
          result.push(makeLink(href, linkChildren, title));
        }
        break;
      }

      case 'img': {
        const src = node.attrs?.src ?? '';
        const alt = node.attrs?.alt ?? '';
        if (src) result.push(makeImage(src, alt));
        break;
      }

      case 'br':
        result.push({ type: 'linebreak', version: 1 });
        break;

      case 'span':
      case 'mark':
      case 'small':
      case 'sup':
      case 'sub':
      case 'abbr':
      case 'cite':
      case 'kbd':
      case 'var':
        result.push(...convertInline(children, inheritFormat));
        break;

      default:
        result.push(...convertInline(children, inheritFormat));
        break;
    }
  }

  return result;
}

export function extractText(nodes: ParsedNode[]): string {
  return nodes.map(n => {
    if (n.type === 'text') return n.text ?? '';
    return extractText(n.children ?? []);
  }).join('');
}
