import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
        404
      </p>
      <h1 className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">Page not found</h1>
      <p className="mt-4 text-gray-500 dark:text-gray-400">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg border border-gray-300 dark:border-gray-700 px-5 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-gray-500 transition-colors"
      >
        ← Back to home
      </Link>
    </main>
  );
}
