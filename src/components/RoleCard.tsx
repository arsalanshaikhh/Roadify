import Link from 'next/link';
import type { Roadmap, RoadmapStats } from '@/lib/types';

const ROLE_ICONS: Record<string, string> = {
  'frontend-engineer': '⚛️',
  'backend-engineer': '🖥️',
  'full-stack': '🔗',
  'devops': '⚙️',
  'mobile-engineer': '📱',
  'security-engineer': '🔒',
  'qa-engineer': '🧪',
  'blockchain-developer': '⛓️',
  'product-manager': '📋',
  'ux-designer': '🎨',
  'data-scientist': '📊',
  'ai-ml-engineer': '🤖',
  'data-engineer': '🛠️',
};

interface Props {
  roadmap: Roadmap;
  categoryColor: string;
  stats: RoadmapStats;
}

export default function RoleCard({ roadmap, categoryColor, stats }: Props) {
  const colorMap: Record<string, string> = {
    indigo: 'text-indigo-600 dark:text-indigo-400',
    sky: 'text-sky-600 dark:text-sky-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
  };
  const accentColor = colorMap[categoryColor] ?? 'text-indigo-600 dark:text-indigo-400';
  const hoursLabel =
    stats.estimatedHours > 0
      ? stats.estimatedHours >= 100
        ? `~${Math.round(stats.estimatedHours / 30)}mo`
        : `~${stats.estimatedHours}h`
      : null;
  const icon = ROLE_ICONS[roadmap.id] ?? '📌';

  return (
    <Link
      href={`/roadmap/${roadmap.id}`}
      className="group block rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl leading-none mt-0.5 flex-shrink-0">{icon}</span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {roadmap.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{roadmap.description}</p>
          <div className={`mt-3 flex items-center gap-3 text-sm font-medium ${accentColor}`}>
            <span>{stats.skillCount} skills</span>
            {stats.freeResourceCount > 0 && <span className="text-gray-300 dark:text-gray-600">·</span>}
            {stats.freeResourceCount > 0 && (
              <span className="text-emerald-600 dark:text-emerald-400">{stats.freeResourceCount} free</span>
            )}
            {hoursLabel && (
              <>
                <span className="text-gray-300 dark:text-gray-600">·</span>
                <span className="text-gray-400 dark:text-gray-500">{hoursLabel}</span>
              </>
            )}
            <span aria-hidden="true" className="ml-auto">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
