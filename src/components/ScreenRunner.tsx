'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import morphdom from 'morphdom';
import { parseTemplate, renderTemplate } from '@/lib/render';

type Mod = { template: string; defaults: Record<string, any>; default: new (p?: any) => any };

export default function ScreenRunner({ mod, kind }: { mod: Mod; kind: 'web' | 'phone' }) {
  const host = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const el = host.current!;
    const frag = parseTemplate(mod.template);
    const inst = new mod.default(mod.defaults);
    let handlers = new Map<string, Function>();
    let queued = false;

    const draw = () => {
      queued = false;
      const next = new Map<string, Function>();
      const html = renderTemplate(frag, inst.renderVals(), next);
      handlers = next;
      const target = document.createElement('div');
      target.style.display = 'contents';
      target.innerHTML = html;
      morphdom(el.firstElementChild as HTMLElement, target, { childrenOnly: true });
    };
    inst._notify = () => {
      if (!queued) {
        queued = true;
        queueMicrotask(draw);
      }
    };
    const shell = document.createElement('div');
    shell.style.display = 'contents';
    el.innerHTML = '';
    el.appendChild(shell);
    draw();

    const fire = (type: string) => (e: Event) => {
      const t = (e.target as Element).closest('[data-ev-' + type + ']');
      if (t && el.contains(t)) handlers.get(t.getAttribute('data-ev-' + type)!)?.(e);
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest('a');
      if (a && el.contains(a)) {
        const href = a.getAttribute('href') || '';
        if (href === '#' || href === '') e.preventDefault();
        else if (href.startsWith('/') && !e.metaKey && !e.ctrlKey && a.target !== '_blank') {
          e.preventDefault();
          router.push(href);
          return;
        }
      }
      fire('click')(e);
    };
    const onChange = fire('change'), onInput = fire('input');
    el.addEventListener('click', onClick);
    el.addEventListener('change', onChange);
    el.addEventListener('input', onInput);
    return () => {
      el.removeEventListener('click', onClick);
      el.removeEventListener('change', onChange);
      el.removeEventListener('input', onInput);
    };
  }, [mod, router]);

  return <div ref={host} data-kind={kind} />;
}
