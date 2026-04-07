// app/components/LoadingState.tsx

'use client';

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">正在生成日记内容...</p>
    </div>
  );
}
