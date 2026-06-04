export default function Loading() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-8 w-28 rounded-lg bg-gray-200 dark:bg-gray-800" />
      </div>
      <div className="mb-2 flex items-start justify-between gap-4">
        <div className="h-7 w-48 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-5 w-20 rounded-full bg-gray-200 dark:bg-gray-800 mt-1 flex-shrink-0" />
      </div>
      <div className="mb-8 space-y-2">
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
      </div>
      <div className="mb-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-5">
        <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-800 mb-3" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>
      </div>
      <div>
        <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-800 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>
      </div>
    </main>
  );
}
