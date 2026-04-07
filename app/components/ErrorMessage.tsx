// app/components/ErrorMessage.tsx

'use client';

import { DiaryError } from '@/app/lib/types/diary';

interface ErrorMessageProps {
  error: DiaryError;
}

export function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <div className="rounded-lg bg-red-50 dark:bg-red-950 p-4 border border-red-200 dark:border-red-800">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            {error.message}
          </h3>
          {error.details && process.env.NODE_ENV === 'development' && (
            <p className="mt-2 text-sm text-red-700 dark:text-red-300">
              {error.details}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
