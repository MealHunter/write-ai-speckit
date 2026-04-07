'use client';

import { useState } from 'react';
import { DiaryForm } from './components/DiaryForm';
import { DiaryDisplay } from './components/DiaryDisplay';
import { DiaryContent } from './lib/types/diary';

export default function Home() {
  const [diaryContent, setDiaryContent] = useState<DiaryContent | null>(null);

  const handleNewEntry = () => {
    setDiaryContent(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            AI Write
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            用AI生成你的日记，记录生活的每一刻
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {!diaryContent ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
            <DiaryForm onSuccess={setDiaryContent} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
              <DiaryDisplay content={diaryContent.content} />
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleNewEntry}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                写新的日记
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
          <p>© 2026 AI Write. 用AI的力量，记录你的故事。</p>
        </div>
      </footer>
    </main>
  );
}
