import Link from 'next/link';
import type { Roadmap } from '@/lib/types';

interface Props {
  roadmap: Roadmap;
  categoryColor: string;
}

export default function RoleCard({ roadmap, categoryColor }: Props) {
  const colorMap: Record<string, string> = {
    indigo: 'text-indigo-400',
    sky: 'text-sky-400',
    emerald: 'text-emerald-400',
  };
  const accentColor = colorMap[categoryColor] ?? 'text-indigo-400';

  return (
    <Link
      href={`/roadmap/${roadmap.id}`}
      className="block rounded-xl border border-gray-800 bg-gray-900 p-5 hover:border-gray-600 transition-colors"
    >
      <h3 className="font-semibold text-white">{roadmap.title}</h3>
      <p className="mt-1 text-sm text-gray-400 line-clamp-2">{roadmap.description}</p>
      <p className={`mt-3 text-sm font-medium ${accentColor}`}>
        {roadmap.nodes.length} skills <span aria-hidden="true">→</span>
      </p>
    </Link>
  );
}
