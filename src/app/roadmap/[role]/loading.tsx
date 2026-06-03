export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-57px)] flex-col lg:flex-row animate-pulse">
      <aside className="hidden w-52 flex-shrink-0 border-r border-gray-800 p-5 lg:block">
        <div className="h-3 w-20 rounded bg-gray-800 mb-6" />
        <div className="space-y-6">
          {['a', 'b', 'c'].map((phase) => (
            <div key={phase}>
              <div className="h-2.5 w-16 rounded bg-gray-800 mb-3" />
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="h-2.5 w-24 rounded bg-gray-800" />
                    <div className="h-4 w-6 rounded bg-gray-800" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b border-gray-800 px-6 py-4">
          <div className="h-5 w-48 rounded bg-gray-800 mb-2" />
          <div className="h-3 w-64 rounded bg-gray-800" />
        </div>
        <div className="flex-1 bg-gray-950 flex items-center justify-center">
          <div className="h-4 w-32 rounded bg-gray-800" />
        </div>
      </div>
    </div>
  );
}
