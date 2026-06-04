import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-6 py-12 mt-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">Roadify</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Curated learning roadmaps for tech roles — with free resources for every skill.
            </p>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">Categories</div>
            <ul className="space-y-2">
              {[
                { href: '/#software', label: '🖥️ Software Engineering' },
                { href: '/#data', label: '📊 Data' },
                { href: '/#ai', label: '🤖 AI & Machine Learning' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">Project</div>
            <ul className="space-y-2">
              <li>
                <a href="https://github.com/arsalanshaikhh/Roadify" target="_blank" rel="noopener noreferrer"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  GitHub →
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-200 dark:border-gray-800 pt-6 text-center text-xs text-gray-400 dark:text-gray-600">
          © {year} Roadify. Free to use, open to learn.
        </div>
      </div>
    </footer>
  );
}
