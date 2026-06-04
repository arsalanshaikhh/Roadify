'use client';

import { useToast } from '@/context/ToastContext';

export default function Toast() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg text-sm font-medium ${
            toast.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900'
          }`}
        >
          {toast.type === 'success' && <span>✓</span>}
          {toast.message}
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 opacity-70 hover:opacity-100 pointer-events-auto"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
