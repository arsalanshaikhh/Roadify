import { notFound } from 'next/navigation';
import { getSkill, getAllSkillSlugs } from '@/lib/content';
import SkillPageClient from '@/components/SkillPageClient';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
}

export async function generateStaticParams() {
  return getAllSkillSlugs().map((slug) => ({ slug }));
}

export default async function SkillPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { from } = await searchParams;

  const skill = getSkill(slug);
  if (!skill) notFound();

  return <SkillPageClient skill={skill} from={from} />;
}
