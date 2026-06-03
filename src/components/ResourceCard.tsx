import type { Resource } from '@/lib/types';

const typeIcons: Record<string, string> = {
  docs: '📄',
  video: '🎥',
  course: '🎓',
  article: '📝',
};

interface Props {
  resource: Resource;
}

export default function ResourceCard({ resource }: Props) {
  const domain = new URL(resource.url).hostname.replace('www.', '');

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900 p-4 hover:border-gray-600 transition-colors"
    >
      <div>
        <p className="font-medium text-white">{resource.title}</p>
        <p className="mt-1 text-xs text-gray-500">
          {typeIcons[resource.type]} {resource.type} · {domain}
        </p>
      </div>
      <div className="ml-4 flex items-center gap-3 flex-shrink-0">
        {resource.free ? (
          <span className="rounded bg-emerald-900/30 px-2 py-0.5 text-xs font-medium text-emerald-400">
            Free
          </span>
        ) : (
          <span className="rounded bg-amber-900/30 px-2 py-0.5 text-xs font-medium text-amber-400">
            Paid
          </span>
        )}
        <span className="text-gray-500">↗</span>
      </div>
    </a>
  );
}
