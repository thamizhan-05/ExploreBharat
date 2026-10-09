'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ErrorPage({
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
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 text-center">
      <div className="max-w-md w-full space-y-6 bg-white p-10 rounded-3xl border border-stone-200/80 shadow-lg">
        <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-stone-900">Something Went Wrong</h2>
          <p className="text-xs text-stone-500">
            An unexpected error occurred while loading this tourism service.
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-bharat-saffron text-white font-bold rounded-2xl text-xs shadow-md"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
