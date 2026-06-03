import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import ThemeProvider from '@/components/ThemeProvider';
import { ProgressProvider } from '@/context/ProgressContext';
import { SearchProvider } from '@/context/SearchContext';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { getAllRoadmaps, getAllSkillSlugs, getSkill } from '@/lib/content';
import type { SearchItem } from '@/context/SearchContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Roadify',
    default: 'Roadify — Find your learning path',
  },
  description:
    'Curated learning roadmaps for software engineering, data science, and AI roles — with free resources for every skill.',
  openGraph: {
    siteName: 'Roadify',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

function buildSearchIndex(): SearchItem[] {
  const roadmaps = getAllRoadmaps();
  const skillSlugs = getAllSkillSlugs();

  const roleItems: SearchItem[] = roadmaps.map((r) => ({
    type: 'role',
    id: r.id,
    title: r.title,
    description: r.description,
    href: `/roadmap/${r.id}`,
  }));

  const skillItems: SearchItem[] = skillSlugs
    .map((slug) => getSkill(slug))
    .filter((s): s is NonNullable<typeof s> => s !== null)
    .map((s) => ({
      type: 'skill',
      id: s.slug,
      title: s.title,
      description: s.description,
      topics: s.topics.join(' '),
      href: `/skill/${s.slug}`,
    }));

  return [...roleItems, ...skillItems];
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const searchItems = buildSearchIndex();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen`}>
        <ThemeProvider>
          <ProgressProvider>
            <SearchProvider items={searchItems}>
              <Navbar />
              {children}
              <Analytics />
              <SpeedInsights />
            </SearchProvider>
          </ProgressProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
