export default function GraphSkeleton() {
  return (
    <div className="h-full w-full bg-gray-50 dark:bg-gray-950 flex items-center justify-center animate-pulse">
      <div className="flex flex-col items-center gap-8 w-full max-w-lg px-8">
        <div className="h-10 w-40 rounded-lg bg-gray-200 dark:bg-gray-800" />
        <div className="flex gap-12">
          <div className="h-10 w-28 rounded-lg bg-gray-200 dark:bg-gray-800" />
          <div className="h-10 w-28 rounded-lg bg-gray-200 dark:bg-gray-800" />
          <div className="h-10 w-28 rounded-lg bg-gray-200 dark:bg-gray-800" />
        </div>
        <div className="flex gap-16">
          <div className="h-10 w-32 rounded-lg bg-gray-200 dark:bg-gray-800" />
          <div className="h-10 w-32 rounded-lg bg-gray-200 dark:bg-gray-800" />
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-4">Loading roadmap...</p>
      </div>
    </div>
  );
}
