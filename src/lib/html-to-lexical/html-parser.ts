export interface ParsedNode {
  type: 'element' | 'text';
  tag?: string;
  attrs?: Record<string, string>;
  children?: ParsedNode[];
  text?: string;
}

export function parseAttrs(attrStr: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const re = /(\w[\w-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]*))?)?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(attrStr)) !== null) {
    const key = m[1] ? m[1].toLowerCase() : "";
    if (!key) continue;
    const val = m[2] ?? m[3] ?? m[4] ?? '';
    attrs[key] = val;
  }
  return attrs;
}

export function decodeHTMLEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

export function parseHTML(html: string): ParsedNode[] {
  const nodes: ParsedNode[] = [];
  let i = 0;
  const len = html.length;

  const VOID = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr']);

  function parseChildren(stopTag?: string): ParsedNode[] {
    const children: ParsedNode[] = [];

    while (i < len) {
      if (html[i] === '<') {
        if (html[i + 1] === '/') {
          const end = html.indexOf('>', i);
          if (end === -1) break;
          const tag = html.slice(i + 2, end).trim().toLowerCase().split(/\s/)[0];
          if (stopTag && tag === stopTag) {
            i = end + 1;
            break;
          }
          i = end + 1;
          continue;
        }

        if (html.startsWith('<!--', i)) {
          const end = html.indexOf('-->', i);
          i = end === -1 ? len : end + 3;
          continue;
        }

        const tagStart = i + 1;
        let tagEnd = tagStart;
        while (tagEnd < len && html[tagEnd] !== '>' && html[tagEnd] !== ' ' && html[tagEnd] !== '\n' && html[tagEnd] !== '\t' && html[tagEnd] !== '/') {
          tagEnd++;
        }
        const tag = html.slice(tagStart, tagEnd).toLowerCase();
        if (!tag) { i++; continue; }

        const gtIdx = html.indexOf('>', i);
        if (gtIdx === -1) break;
        const attrStr = html.slice(tagEnd, gtIdx).replace(/\/$/, '').trim();
        const attrs = parseAttrs(attrStr);
        const selfClose = html[gtIdx - 1] === '/' || VOID.has(tag);
        i = gtIdx + 1;

        if (selfClose) {
          children.push({ type: 'element', tag, attrs, children: [] });
          continue;
        }

        const inner = parseChildren(tag);
        children.push({ type: 'element', tag, attrs, children: inner });
      } else {
        const next = html.indexOf('<', i);
        const raw = next === -1 ? html.slice(i) : html.slice(i, next);
        i = next === -1 ? len : next;
        const text = decodeHTMLEntities(raw);
        if (text) children.push({ type: 'text', text });
      }
    }

    return children;
  }

  const stripped = html
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .replace(/<\/?(?:html|head|body)[^>]*>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .trim();

  i = 0;
  const result = parseChildren();
  nodes.push(...result);
  return nodes;
}
