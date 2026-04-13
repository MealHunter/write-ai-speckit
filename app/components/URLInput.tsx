/**
 * URLInput Component
 * Input field for article URL with validation
 */

'use client';

import { useState } from 'react';
import { validateUrl } from '@/app/lib/newsUtils';

interface URLInputProps {
  onSubmit: (url: string) => void;
  disabled?: boolean;
  placeholder?: string;
  wordLimit?: number;
  onWordLimitChange?: (limit: number) => void;
}

export function URLInput({
  onSubmit,
  disabled = false,
  placeholder = 'Enter article URL (WeChat, Zhihu, or news website)',
  wordLimit = 1000,
  onWordLimitChange,
}: URLInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setError('');
  };

  const handleWordLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      onWordLimitChange?.(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }

    onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={handleChange}
            disabled={disabled}
            placeholder={placeholder}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={disabled}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            Parse & Generate
          </button>
        </div>

        {/* Word Limit Control */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Article Word Limit:
          </label>
          <input
            type="number"
            value={wordLimit}
            onChange={handleWordLimitChange}
            disabled={disabled}
            min="100"
            max="5000"
            step="100"
            className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">words</span>
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    </form>
  );
}
