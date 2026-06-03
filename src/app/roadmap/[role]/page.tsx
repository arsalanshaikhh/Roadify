import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRoadmap, getAllRoadmaps } from '@/lib/content';
import TopicsSidebar from '@/components/TopicsSidebar';
import RoadmapGraphClient from '@/components/RoadmapGraphClient';

interface Props {
  params: Promise<{ role: string }>;
}

export function generateStaticParams() {
  return getAllRoadmaps().map((r) => ({ role: r.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { role } = await params;
  const roadmap = getRoadmap(role);
  if (!roadmap) return {};
  return {
    title: roadmap.title,
    description: roadmap.description,
    openGraph: {
      title: roadmap.title,
      description: roadmap.description,
    },
  };
}

export default async function RoadmapPage({ params }: Props) {
  const { role } = await params;
  const roadmap = getRoadmap(role);
  if (!roadmap) notFound();

  return (
    <div className="flex h-[calc(100vh-57px)] flex-col lg:flex-row">
      <TopicsSidebar nodes={roadmap.nodes} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b border-gray-800 px-6 py-4">
          <h1 className="text-lg font-bold text-white">{roadmap.title}</h1>
          <p className="text-sm text-gray-400">
            {roadmap.nodes.length} skills · Click any node to explore resources
          </p>
        </div>
        <div className="flex-1">
          <RoadmapGraphClient
            nodes={roadmap.nodes}
            edges={roadmap.edges}
            fromRole={roadmap.id}
          />
        </div>
      </div>
    </div>
  );
}
