import type { MetadataRoute } from 'next';
import { getAllRoadmaps, getAllSkillSlugs } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://devroadmap.vercel.app';

  const roadmapEntries = getAllRoadmaps().map((r) => ({
    url: `${baseUrl}/roadmap/${r.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const skillEntries = getAllSkillSlugs().map((slug) => ({
    url: `${baseUrl}/skill/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    ...roadmapEntries,
    ...skillEntries,
  ];
}
