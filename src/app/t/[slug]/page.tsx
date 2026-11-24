import { notFound } from 'next/navigation';
import screens from '@/lib/screens.json';
import ScreenLoader from '@/components/ScreenLoader';

export const dynamicParams = false;
export function generateStaticParams() {
  return screens.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = screens.find((x) => x.slug === slug);
  return { title: s ? `${s.title} · LogArt` : 'LogArt' };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = screens.find((x) => x.slug === slug);
  if (!s) notFound();
  return <ScreenLoader slug={slug} kind={s.kind as 'web' | 'phone'} />;
}
