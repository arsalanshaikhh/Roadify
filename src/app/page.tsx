import { getAllRoadmaps, getCategories } from '@/lib/content';
import RoleSearch from '@/components/RoleSearch';

export default function Home() {
  const categories = getCategories();
  const roadmaps = getAllRoadmaps();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white">Find your learning path</h1>
        <p className="mt-3 text-gray-400">
          Pick a role to explore a curated roadmap with resources
        </p>
      </div>
      <RoleSearch roadmaps={roadmaps} categories={categories} />
    </main>
  );
}
