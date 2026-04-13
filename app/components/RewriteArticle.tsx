/**
 * RewriteArticle Component
 * Displays AI-generated rewritten article with title selection
 */

'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { RewriteArticle as RewriteArticleType } from '@/app/lib/types/news';
import { copyToClipboard } from '@/app/lib/newsUtils';

interface RewriteArticleProps {
  article: RewriteArticleType;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export function RewriteArticle({
  article,
  onRegenerate,
  isRegenerating = false,
}: RewriteArticleProps) {
  const [selectedTitle, setSelectedTitle] = useState(article.selectedTitle);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(article.content);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          AI Rewritten Article
        </h2>

        {/* Title Selection */}
        <div className="space-y-2 mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Select Title
          </label>
          <select
            value={selectedTitle}
            onChange={(e) => setSelectedTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {article.titles.map((title, index) => (
              <option key={index} value={title}>
                {index + 1}. {title}
              </option>
            ))}
          </select>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <span>Word Count: {article.wordCount}</span>
          <span>
            Generated in {(article.generationTime / 1000).toFixed(1)}s
          </span>
          <span>Model: {article.model}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            {copied ? 'Copied!' : 'Copy'}
          </button>

          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {isRegenerating ? 'Regenerating...' : 'Regenerate'}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="prose dark:prose-invert max-w-none">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {selectedTitle}
        </h1>

        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-4" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-5 mb-3" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-4 mb-2" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="text-gray-700 dark:text-gray-300" {...props} />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-l-4 border-blue-600 pl-4 italic text-gray-600 dark:text-gray-400 my-4" {...props} />
            ),
            code: ({ node, inline, ...props }: any) =>
              inline ? (
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono text-gray-900 dark:text-white" {...props} />
              ) : (
                <code className="block bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm font-mono text-gray-900 dark:text-white overflow-x-auto mb-4" {...props} />
              ),
          }}
        >
          {article.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
