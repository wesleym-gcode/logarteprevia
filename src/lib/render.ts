/**
 * Runtime de templates do canvas: avalia {{buracos}}, <sc-for> e <sc-if> contra o
 * objeto devolvido por renderVals() e produz HTML. Os eventos viram atributos
 * data-ev-* e são tratados por delegação em ScreenRunner.
 */
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const BOOL = new Set(['checked', 'disabled', 'selected', 'hidden', 'readonly', 'required', 'open', 'autofocus']);
const HOLE = /\{\{\s*([\w.$]+)\s*\}\}/g;
const SOLE = /^\s*\{\{\s*([\w.$]+)\s*\}\}\s*$/;

type Scope = Record<string, any>;

const get = (scope: Scope, path: string) => {
  let cur: any = scope;
  for (const p of path.split('.')) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
};
const truthy = (v: any) => !(v === false || v == null || v === 0 || v === '' || v === 'false');
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s: string) => esc(s).replace(/"/g, '&quot;');
const interp = (s: string, scope: Scope) =>
  s.replace(HOLE, (_, p) => {
    const v = get(scope, p);
    return v == null || typeof v === 'function' ? '' : String(v);
  });

export function parseTemplate(html: string): DocumentFragment {
  const t = document.createElement('template');
  t.innerHTML = html;
  return t.content;
}

export function renderTemplate(frag: DocumentFragment, vals: Scope, handlers: Map<string, Function>): string {
  let seq = 0;
  const walk = (node: Node, scope: Scope): string => {
    if (node.nodeType === 3) return esc(interp(node.textContent || '', scope));
    if (node.nodeType !== 1) return '';
    const el = node as Element;
    const tag = el.tagName.toLowerCase();
    const kids = (sc: Scope) => Array.from(el.childNodes).map((c) => walk(c, sc)).join('');
    if (tag === 'sc-for') {
      const list = get(scope, (el.getAttribute('list') || '').replace(/[{}\s]/g, '')) || [];
      const as = el.getAttribute('as') || 'item';
      return (list as any[]).map((item, i) => kids(Object.assign({}, scope, { [as]: item, [as + '_index']: i }))).join('');
    }
    if (tag === 'sc-if') {
      return truthy(get(scope, (el.getAttribute('value') || '').replace(/[{}\s]/g, ''))) ? kids(scope) : '';
    }
    let attrs = '';
    let taValue: string | null = null;
    for (const a of Array.from(el.attributes)) {
      const name = a.name;
      if (name.startsWith('hint-')) continue;
      const sole = SOLE.exec(a.value);
      if (/^on[a-z]+$/.test(name) && sole) {
        const fn = get(scope, sole[1]);
        if (typeof fn !== 'function') continue;
        const id = 'h' + seq++;
        handlers.set(id, fn);
        let ev = name.slice(2);
        if (ev === 'change' && (tag === 'textarea' || (tag === 'input' && !['checkbox', 'radio', 'file', 'range'].includes(el.getAttribute('type') || 'text')))) ev = 'input';
        attrs += ' data-ev-' + ev + '="' + id + '"';
        continue;
      }
      if (tag === 'textarea' && name === 'value') {
        taValue = interp(a.value, scope);
        continue;
      }
      if (BOOL.has(name) && sole) {
        if (truthy(get(scope, sole[1]))) attrs += ' ' + name;
        continue;
      }
      attrs += ' ' + name + '="' + escAttr(interp(a.value, scope)) + '"';
    }
    if (taValue !== null) return '<textarea' + attrs + '>' + esc(taValue) + '</textarea>';
    if (VOID.has(tag)) return '<' + tag + attrs + '>';
    return '<' + tag + attrs + '>' + kids(scope) + '</' + tag + '>';
  };
  return Array.from(frag.childNodes).map((n) => walk(n, vals)).join('');
}
