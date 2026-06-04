'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-red-500 dark:text-red-400">
        Error
      </p>
      <h1 className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">Something went wrong</h1>
      <p className="mt-4 text-gray-500 dark:text-gray-400">
        {process.env.NODE_ENV === 'development'
          ? error.message
          : 'An unexpected error occurred.'}
      </p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={reset}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-gray-300 dark:border-gray-700 px-5 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-gray-500 transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
