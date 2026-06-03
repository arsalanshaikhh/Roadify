'use client';

import { useEffect } from 'react';
import './globals.css';

export default function GlobalError({
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
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-red-400">
          Critical Error
        </p>
        <h1 className="mt-4 text-4xl font-bold text-white">Something went wrong</h1>
        <p className="mt-4 text-gray-400">
          {process.env.NODE_ENV === 'development'
            ? error.message
            : 'A critical error occurred. Please refresh the page.'}
        </p>
        <button
          onClick={reset}
          className="mt-8 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
