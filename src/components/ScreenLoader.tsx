'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { registry } from '@/screens/registry';
import ScreenRunner from './ScreenRunner';

export default function ScreenLoader({ slug, kind }: { slug: string; kind: 'web' | 'phone' }) {
  const [mod, setMod] = useState<any>(null);
  useEffect(() => {
    registry[slug]?.().then(setMod);
  }, [slug]);

  const runner = mod ? <ScreenRunner key={slug} mod={mod} kind={kind} /> : <div style={{ minHeight: 400 }} />;
  return (
    <>
      {kind === 'phone' ? (
        <div className="phone-stage"><div className="phone-frame">{runner}</div></div>
      ) : (
        runner
      )}
      <Link
        href="/"
        data-preview-chrome
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-[#0E1726] px-4 py-2.5 text-[13px] font-semibold !text-white shadow-lg ring-1 ring-white/10 hover:!text-white"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
        Mapa de telas
        <span className="ml-1 rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-medium text-white/80">dados fictícios</span>
      </Link>
    </>
  );
}
