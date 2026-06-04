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

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="flex items-center gap-0.5 text-amber-400 text-xs">
      {Array.from({ length: 5 }, (_, i) => {
        if (i < full) return <span key={i}>★</span>;
        if (i === full && half) return <span key={i} className="opacity-50">★</span>;
        return <span key={i} className="opacity-20">★</span>;
      })}
      <span className="ml-1 text-gray-400 dark:text-gray-500">{rating.toFixed(1)}</span>
    </span>
  );
}

export default function ResourceCard({ resource }: Props) {
  const domain = new URL(resource.url).hostname.replace('www.', '');

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-0.5 hover:shadow-md transition-all"
    >
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{resource.title}</p>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          {typeIcons[resource.type]} {resource.type} · {domain}
        </p>
        {resource.rating != null && (
          <div className="mt-1">
            <StarRating rating={resource.rating} />
          </div>
        )}
      </div>
      <div className="ml-4 flex items-center gap-3 flex-shrink-0">
        {resource.free ? (
          <span className="rounded bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            Free
          </span>
        ) : (
          <span className="rounded bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
            Paid
          </span>
        )}
        <span className="text-gray-400 dark:text-gray-500">↗</span>
      </div>
    </a>
  );
}
