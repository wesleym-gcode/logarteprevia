import Link from 'next/link';
import screens from '@/lib/screens.json';
import { FLOWS, GROUPS } from '@/lib/groups';

const by = Object.fromEntries(screens.map((s) => [s.slug, s]));
const kindLabel = (k: string, slug: string) =>
  k === 'phone' ? (['rastreio', 'orcamento', 'comprovante', 'reagendar'].includes(slug) ? 'Cliente' : 'App') : 'Painel';
const kindStyle: Record<string, string> = {
  Painel: 'bg-[#EEF3FE] text-[#1A41B3]',
  App: 'bg-[#FFF4E8] text-[#94480C]',
  Cliente: 'bg-[#E2F5F0] text-[#0F6E5A]',
};

function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" rx="12" fill="#1F4FD6" />
      <path d="M12 33 C 18 33, 18 15, 24 15 S 30 33, 36 33" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <circle cx="12" cy="33" r="3.5" fill="#fff" />
      <circle cx="36" cy="33" r="4.5" fill="#F08A24" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F6F7F9]">
      <header className="bg-[#0E1726] text-white">
        <div className="mx-auto max-w-[1180px] px-6 pb-16 pt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo />
              <span className="text-[22px] font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>LogArt</span>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[12px] font-medium text-white/80">Prévia navegável · dados fictícios</span>
          </div>
          <h1 className="mt-14 max-w-[820px] text-[40px] font-semibold leading-[1.1] tracking-tight md:text-[52px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Cada volume etiquetado, lido e rastreado até a porta do cliente.
          </h1>
          <p className="mt-5 max-w-[680px] text-[17px] leading-relaxed text-[#C5CCD8]">
            Esta prévia mostra as telas do painel, do app do motorista e das páginas do cliente final. Tudo é clicável e usa dados de exemplo da Transportes Guanabara. Nada é gravado.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/t/painel" className="rounded-xl bg-[#1F4FD6] px-5 py-3 text-[15px] font-semibold !text-white hover:bg-[#1A41B3]">Abrir o painel</Link>
            <Link href="/t/mot-rota" className="rounded-xl border border-white/25 px-5 py-3 text-[15px] font-semibold !text-white hover:bg-white/10">Abrir o app do motorista</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto -mt-8 max-w-[1180px] px-6" aria-label="Os três pedidos do cliente">
        <div className="grid gap-5 md:grid-cols-3">
          {FLOWS.map((f) => (
            <article key={f.id} className="flex flex-col rounded-2xl border border-[#EAECF0] bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.06),0_8px_24px_rgba(16,24,40,0.06)]">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-[#F08A24]">{f.tag}</span>
              <h2 className="mt-1 text-[20px] font-semibold leading-snug tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{f.title}</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-[#4B5563]">{f.text}</p>
              <ul className="mt-4 flex flex-col divide-y divide-[#F0F2F5] border-t border-[#F0F2F5]">
                {f.links.map((l) => (
                  <li key={l.slug}>
                    <Link href={'/t/' + l.slug} className="flex items-center justify-between gap-3 py-2.5 text-[14px] font-medium !text-[#111827] hover:!text-[#1F4FD6]">
                      <span>{l.label}</span>
                      <span className={'rounded-full px-2 py-0.5 text-[11px] font-semibold ' + kindStyle[l.where]}>{l.where}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 pb-24 pt-16" aria-label="Mapa de telas">
        <h2 className="text-[28px] font-semibold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Mapa de telas</h2>
        <p className="mt-1 text-[15px] text-[#4B5563]">{screens.length} telas. Clique para abrir; as que têm botões e filtros respondem ao clique.</p>
        {GROUPS.map((g) => (
          <div key={g.title} className="mt-10">
            <h3 className="flex items-center gap-2 text-[17px] font-semibold">
              {g.title}
              {g.note && <span className="rounded-full bg-[#E5F5EA] px-2 py-0.5 text-[11px] font-semibold text-[#17713A]">{g.note}</span>}
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {g.slugs.map((slug) => {
                const s = by[slug];
                if (!s) return null;
                const kl = kindLabel(s.kind, slug);
                return (
                  <Link key={slug} href={'/t/' + slug} className="group flex flex-col overflow-hidden rounded-xl border border-[#EAECF0] bg-white !text-[#111827] transition hover:border-[#8EABF4] hover:shadow-md">
                    <div className={'relative overflow-hidden bg-[#EEF0F3] ' + (s.kind === 'phone' ? 'flex h-[200px] justify-center' : 'h-[200px]')}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={'/thumbs/' + slug + '.jpg'} alt="" loading="lazy" className={s.kind === 'phone' ? 'h-full w-auto object-cover object-top' : 'h-full w-full object-cover object-top'} />
                    </div>
                    <div className="flex items-start justify-between gap-2 p-3.5">
                      <span className="text-[14px] font-semibold leading-snug">{s.title}</span>
                      <span className={'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ' + kindStyle[kl]}>{kl}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <footer className="border-t border-[#EAECF0] bg-white py-8 text-center text-[13px] text-[#4B5563]">
        LogArt · prévia de design com dados fictícios · v0.3
      </footer>
    </main>
  );
}
