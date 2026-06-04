type Filter = 'all' | 'free' | 'paid';
interface Props { active: Filter; onChange: (filter: Filter) => void; }
const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid' },
];
export default function ResourceFilter({ active, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`rounded px-3 py-1 text-sm transition-colors ${
            active === f.value
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
