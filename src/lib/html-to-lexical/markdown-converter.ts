import type { ParsedNode } from './html-parser';
import { parseHTML } from './html-parser';
import { extractText } from './inline-converter';
import { findAll } from './block-converter';

export function htmlToMarkdown(html: string): string {
  if (!html || !html.trim()) return '';

  const isHTML = /<[a-z][\s\S]*>/i.test(html);
  if (!isHTML) return html.trim();

  const parsed = parseHTML(html);
  return nodesToMarkdown(parsed).trim();
}

export function nodesToMarkdown(nodes: ParsedNode[], listDepth = 0, listType: 'ul' | 'ol' | null = null): string {
  const parts: string[] = [];
  let listCounter = 1;

  for (const node of nodes) {
    if (node.type === 'text') {
      const text = (node.text ?? '').replace(/\n+/g, ' ').trim();
      if (text) parts.push(text);
      continue;
    }

    const tag = node.tag ?? '';
    const children = node.children ?? [];

    switch (tag) {
      case 'h1': parts.push(`\n# ${inlineToMarkdown(children)}\n`); break;
      case 'h2': parts.push(`\n## ${inlineToMarkdown(children)}\n`); break;
      case 'h3': parts.push(`\n### ${inlineToMarkdown(children)}\n`); break;
      case 'h4': parts.push(`\n#### ${inlineToMarkdown(children)}\n`); break;
      case 'h5': parts.push(`\n##### ${inlineToMarkdown(children)}\n`); break;
      case 'h6': parts.push(`\n###### ${inlineToMarkdown(children)}\n`); break;

      case 'p': {
        const text = inlineToMarkdown(children);
        if (text.trim()) parts.push(`\n${text}\n`);
        break;
      }

      case 'blockquote': {
        const inner = nodesToMarkdown(children).trim();
        const quoted = inner.split('\n').map(l => `> ${l}`).join('\n');
        parts.push(`\n${quoted}\n`);
        break;
      }

      case 'ul': {
        const items = children.filter(c => c.type === 'element' && c.tag === 'li');
        const indent = '  '.repeat(listDepth);
        for (const item of items) {
          const text = inlineToMarkdown(item.children ?? []);
          parts.push(`\n${indent}- ${text}`);
          const nested = (item.children ?? []).filter(c => c.type === 'element' && (c.tag === 'ul' || c.tag === 'ol'));
          for (const n of nested) {
            parts.push(nodesToMarkdown([n], listDepth + 1));
          }
        }
        parts.push('\n');
        break;
      }

      case 'ol': {
        const items = children.filter(c => c.type === 'element' && c.tag === 'li');
        const indent = '  '.repeat(listDepth);
        let counter = 1;
        for (const item of items) {
          const text = inlineToMarkdown(item.children ?? []);
          parts.push(`\n${indent}${counter++}. ${text}`);
          const nested = (item.children ?? []).filter(c => c.type === 'element' && (c.tag === 'ul' || c.tag === 'ol'));
          for (const n of nested) {
            parts.push(nodesToMarkdown([n], listDepth + 1));
          }
        }
        parts.push('\n');
        break;
      }

      case 'pre': {
        const codeEl = children.find(c => c.type === 'element' && c.tag === 'code');
        const lang = codeEl?.attrs?.class?.replace(/language-/, '') ?? '';
        const code = extractText(codeEl?.children ?? children);
        parts.push(`\n\`\`\`${lang}\n${code}\n\`\`\`\n`);
        break;
      }

      case 'hr':
        parts.push('\n---\n');
        break;

      case 'br':
        parts.push('\n');
        break;

      case 'img': {
        const src = node.attrs?.src ?? '';
        const alt = node.attrs?.alt ?? '';
        if (src) parts.push(`\n![${alt}](${src})\n`);
        break;
      }

      case 'figure': {
        const imgEl = children.find(c => c.type === 'element' && c.tag === 'img');
        if (imgEl) {
          const src = imgEl.attrs?.src ?? '';
          const alt = imgEl.attrs?.alt ?? '';
          if (src) parts.push(`\n![${alt}](${src})\n`);
        }
        break;
      }

      case 'table': {
        const rows = findAll(children, ['tr']);
        for (const row of rows) {
          const cells = findAll([row], ['td', 'th']);
          const line = cells.map(c => extractText(c.children ?? []).trim()).join(' | ');
          if (line.trim()) parts.push(`\n${line}`);
        }
        parts.push('\n');
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
        parts.push(nodesToMarkdown(children, listDepth));
        break;

      default:
        parts.push(inlineToMarkdown([node]));
        break;
    }
  }

  return parts.join('');
}

export function inlineToMarkdown(nodes: ParsedNode[]): string {
  return nodes.map(node => {
    if (node.type === 'text') return node.text ?? '';

    const tag = node.tag ?? '';
    const children = node.children ?? [];

    switch (tag) {
      case 'strong':
      case 'b': return `**${inlineToMarkdown(children)}**`;
      case 'em':
      case 'i': return `*${inlineToMarkdown(children)}*`;
      case 'u': return inlineToMarkdown(children);
      case 's':
      case 'del':
      case 'strike': return `~~${inlineToMarkdown(children)}~~`;
      case 'code': return `\`${extractText(children)}\``;
      case 'a': {
        const href = node.attrs?.href ?? '#';
        const text = inlineToMarkdown(children) || href;
        return `[${text}](${href})`;
      }
      case 'img': {
        const src = node.attrs?.src ?? '';
        const alt = node.attrs?.alt ?? '';
        return src ? `![${alt}](${src})` : '';
      }
      case 'br': return '\n';
      case 'span':
      case 'mark':
      case 'small':
      case 'abbr':
      case 'cite':
      case 'kbd':
      case 'var':
      case 'sup':
      case 'sub':
        return inlineToMarkdown(children);
      default:
        return inlineToMarkdown(children);
    }
  }).join('');
}
