/**
 * News Rewrite Tool - Main Page
 * Integrates all components for the complete workflow
 */

'use client';

import { useState } from 'react';
import { URLInput } from '@/app/components/URLInput';
import { LoadingState } from '@/app/components/NewsLoadingState';
import { OriginalContent } from '@/app/components/OriginalContent';
import { RewriteArticle } from '@/app/components/RewriteArticle';
import { ErrorMessage } from '@/app/components/NewsErrorMessage';
import { ParsedArticle, RewriteArticle as RewriteArticleType } from '@/app/lib/types/news';

type PageState = 'idle' | 'loading' | 'success' | 'error';

interface PageData {
  article: ParsedArticle | null;
  rewriteArticle: RewriteArticleType | null;
}

export default function NewsRewritePage() {
  const [state, setState] = useState<PageState>('idle');
  const [data, setData] = useState<PageData>({
    article: null,
    rewriteArticle: null,
  });
  const [error, setError] = useState<string>('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [wordLimit, setWordLimit] = useState<number>(1000);

  const handleParseAndGenerate = async (url: string) => {
    setState('loading');
    setError('');

    try {
      // Step 1: Parse URL
      const parseResponse = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!parseResponse.ok) {
        const errorData = await parseResponse.json();
        throw new Error(errorData.error || 'Failed to parse URL');
      }

      const parseData = await parseResponse.json();
      const { article } = parseData.data;

      // Step 2: Generate article
      const generateResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: article.id, wordLimit }),
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(errorData.error || 'Failed to generate article');
      }

      const generateData = await generateResponse.json();
      const { rewriteArticle } = generateData.data;

      setData({
        article,
        rewriteArticle,
      });

      setState('success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      setState('error');
    }
  };

  const handleRegenerate = async () => {
    if (!data.article) return;

    setIsRegenerating(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId: data.article.id,
          regenerate: true,
          wordLimit,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to regenerate article');
      }

      const generateData = await response.json();
      const { rewriteArticle } = generateData.data;

      setData((prev) => ({
        ...prev,
        rewriteArticle,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleReset = () => {
    setState('idle');
    setData({
      article: null,
      rewriteArticle: null,
    });
    setError('');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            AI News Rewrite Tool
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Transform trending news into WeChat Official Account articles
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* URL Input */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <URLInput
            onSubmit={handleParseAndGenerate}
            disabled={state === 'loading'}
            wordLimit={wordLimit}
            onWordLimitChange={setWordLimit}
          />
        </div>

        {/* Error Message */}
        {state === 'error' && (
          <div className="mb-8">
            <ErrorMessage
              message={error}
              onDismiss={handleReset}
              onRetry={handleReset}
              showRetry={true}
            />
          </div>
        )}

        {/* Loading State */}
        {state === 'loading' && <LoadingState />}

        {/* Success State */}
        {state === 'success' && data.article && data.rewriteArticle && (
          <div className="space-y-8">
            {/* Original Content */}
            <OriginalContent article={data.article} />

            {/* Rewritten Article */}
            <RewriteArticle
              article={data.rewriteArticle}
              onRegenerate={handleRegenerate}
              isRegenerating={isRegenerating}
            />

            {/* Reset Button */}
            <div className="flex justify-center">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Process Another Article
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
          <p>© 2026 AI News Rewrite Tool. Powered by Aliyun Dashscope.</p>
        </div>
      </footer>
    </main>
  );
}
