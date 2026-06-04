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
  const totalSkills = roadmaps.reduce((sum, r) => sum + r.nodes.length, 0);
  const totalResources = Object.values(statsMap).reduce(
    (sum, s) => sum + s.freeResourceCount + s.paidResourceCount,
    0
  );

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-6 py-20 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent dark:from-indigo-950/40" />
        <div className="relative mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-6">
            ✦ Free · No account required · Open source
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Find your path
            <span className="block text-indigo-600 dark:text-indigo-400">in tech</span>
          </h1>
          <p className="mt-6 text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Curated learning roadmaps for {roadmaps.length} tech roles — with free resources for every skill. No fluff, just signal.
          </p>
          <div className="mt-8 flex items-center justify-center gap-8 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{roadmaps.length}</div>
              <div className="text-gray-500 dark:text-gray-400">Roles</div>
            </div>
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-800" />
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalSkills}+</div>
              <div className="text-gray-500 dark:text-gray-400">Skills</div>
            </div>
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-800" />
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalResources}+</div>
              <div className="text-gray-500 dark:text-gray-400">Resources</div>
            </div>
          </div>
          <a
            href="#roles"
            className="mt-10 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/25"
          >
            Explore Roles
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </section>

      {/* Role Grid */}
      <main id="roles" className="mx-auto max-w-6xl px-6 py-12">
        <RoleSearch roadmaps={roadmaps} categories={categories} statsMap={statsMap} />
      </main>
    </>
  );
}
