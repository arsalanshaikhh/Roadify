import { getAllRoadmaps, getCategories, getRoadmapStats } from '@/lib/content';
import RoleSearch from '@/components/RoleSearch';
import type { RoadmapStats } from '@/lib/types';

export default function Home() {
  const categories = getCategories();
  const roadmaps = getAllRoadmaps();
  const statsMap: Record<string, RoadmapStats> = {};
  for (const roadmap of roadmaps) {
    statsMap[roadmap.id] = getRoadmapStats(roadmap);
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white">Find your learning path</h1>
        <p className="mt-3 text-gray-400">
          Pick a role to explore a curated roadmap with resources
        </p>
      </div>
      <RoleSearch roadmaps={roadmaps} categories={categories} statsMap={statsMap} />
    </main>
  );
}
