// app/components/DiaryDisplay.tsx

'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/app/lib/utils';

interface DiaryDisplayProps {
  content: string;
  className?: string;
}

export function DiaryDisplay({ content, className }: DiaryDisplayProps) {
  return (
    <div
      className={cn(
        'prose prose-sm dark:prose-invert max-w-2xl mx-auto',
        'prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white',
        'prose-p:text-gray-700 dark:prose-p:text-gray-300',
        'prose-strong:font-semibold prose-strong:text-gray-900 dark:prose-strong:text-white',
        'prose-em:italic prose-em:text-gray-700 dark:prose-em:text-gray-300',
        'prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded',
        'prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:text-gray-100',
        'prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600',
        'prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400',
        'prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6',
        'prose-li:text-gray-700 dark:prose-li:text-gray-300',
        'prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:underline',
        'prose-hr:border-gray-300 dark:prose-hr:border-gray-600',
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
