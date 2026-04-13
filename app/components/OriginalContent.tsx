/**
 * OriginalContent Component
 * Displays parsed article with collapsible content
 */

'use client';

import { useState } from 'react';
import { ParsedArticle } from '@/app/lib/types/news';

interface OriginalContentProps {
  article: ParsedArticle;
}

export function OriginalContent({ article }: OriginalContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="text-left">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Original Content
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {article.platform.charAt(0).toUpperCase() + article.platform.slice(1)} • {article.contentLength} characters
          </p>
        </div>
        <svg
          className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {article.title}
            </h3>
            {article.author && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                By {article.author}
              </p>
            )}
            {article.publishedAt && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(article.publishedAt).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="prose dark:prose-invert max-w-none">
            {article.body.split('\n\n').map((paragraph, index) => (
              <p
                key={index}
                className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
