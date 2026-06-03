import Link from 'next/link';
import type { Roadmap, RoadmapStats } from '@/lib/types';

interface Props {
  roadmap: Roadmap;
  categoryColor: string;
  stats: RoadmapStats;
}

export default function RoleCard({ roadmap, categoryColor, stats }: Props) {
  const colorMap: Record<string, string> = {
    indigo: 'text-indigo-400',
    sky: 'text-sky-400',
    emerald: 'text-emerald-400',
  };
  const accentColor = colorMap[categoryColor] ?? 'text-indigo-400';
  const hoursLabel =
    stats.estimatedHours > 0
      ? stats.estimatedHours >= 100
        ? `~${Math.round(stats.estimatedHours / 30)}mo`
        : `~${stats.estimatedHours}h`
      : null;

  return (
    <Link
      href={`/roadmap/${roadmap.id}`}
      className="block rounded-xl border border-gray-800 bg-gray-900 p-5 hover:border-gray-600 transition-colors"
    >
      <h3 className="font-semibold text-white">{roadmap.title}</h3>
      <p className="mt-1 text-sm text-gray-400 line-clamp-2">{roadmap.description}</p>
      <div className={`mt-3 flex items-center gap-3 text-sm font-medium ${accentColor}`}>
        <span>{stats.skillCount} skills</span>
        {stats.freeResourceCount > 0 && (
          <span className="text-gray-500">·</span>
        )}
        {stats.freeResourceCount > 0 && (
          <span className="text-emerald-400">{stats.freeResourceCount} free</span>
        )}
        {hoursLabel && (
          <>
            <span className="text-gray-500">·</span>
            <span className="text-gray-400">{hoursLabel}</span>
          </>
        )}
        <span aria-hidden="true" className="ml-auto">→</span>
      </div>
    </Link>
  );
}
