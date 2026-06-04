interface Props {
  topics: string[];
}

export default function TopicsChips({ topics }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {topics.map((topic) => (
        <span
          key={topic}
          className="rounded border border-indigo-200 dark:border-indigo-800/50 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 text-sm text-indigo-700 dark:text-indigo-300"
        >
          {topic}
        </span>
      ))}
    </div>
  );
}
