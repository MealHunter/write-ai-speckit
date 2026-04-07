// app/components/DiaryForm.tsx

'use client';

import { useState } from 'react';
import { DiaryContent, DiaryError } from '@/app/lib/types/diary';
import { LoadingState } from './LoadingState';
import { ErrorMessage } from './ErrorMessage';

interface DiaryFormProps {
  onSuccess?: (content: DiaryContent) => void;
}

export function DiaryForm({ onSuccess }: DiaryFormProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<DiaryError | null>(null);
  const [charCount, setCharCount] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    setCharCount(value.length);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!input.trim()) {
      setError({
        code: 'EMPTY_INPUT',
        message: '请输入至少一个字符',
        timestamp: new Date(),
      });
      return;
    }

    if (input.length > 500) {
      setError({
        code: 'INPUT_TOO_LONG',
        message: '输入内容不能超过500字符',
        timestamp: new Date(),
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-diary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || {
          code: 'API_ERROR',
          message: '服务暂时不可用，请稍后重试',
          timestamp: new Date(),
        });
        return;
      }

      if (data.data) {
        setInput('');
        setCharCount(0);
        onSuccess?.(data.data);
      }
    } catch (err) {
      setError({
        code: 'API_ERROR',
        message: '网络错误，请检查连接后重试',
        timestamp: new Date(),
        details: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="input" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            输入关键词或描述
          </label>
          <textarea
            id="input"
            value={input}
            onChange={handleInputChange}
            placeholder="例如：清明节、春天、旅行..."
            disabled={isLoading}
            aria-label="日记内容输入框"
            aria-describedby="char-count"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
            rows={5}
          />
          <div className="mt-2 flex justify-between items-center">
            <p id="char-count" className="text-xs text-gray-500 dark:text-gray-400">
              {charCount}/500 字符
            </p>
            {charCount > 450 && (
              <p className="text-xs text-orange-600 dark:text-orange-400" role="alert">
                接近字符限制
              </p>
            )}
          </div>
        </div>

        {error && <ErrorMessage error={error} />}

        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          aria-busy={isLoading}
          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
        >
          {isLoading ? '生成中...' : '生成日记'}
        </button>
      </form>
    </div>
  );
}
