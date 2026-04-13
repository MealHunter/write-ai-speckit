/**
 * Article Generation Service
 * Handles LLM-based article rewriting
 */

import { v4 as uuidv4 } from 'uuid';
import { generateText } from './newsClient';
import {
  SYSTEM_PROMPT,
  createParsePrompt,
  parseGenerationResponse,
  calculateWordCount,
} from './newsPrompts';
import { RewriteArticle, ParsedArticle } from '../types/news';

export interface GenerationOptions {
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
}

/**
 * Generate rewritten article from parsed content
 */
export async function generateArticle(
  article: ParsedArticle,
  options?: GenerationOptions
): Promise<RewriteArticle> {
  const startTime = Date.now();

  try {
    // Create prompt
    const userPrompt = createParsePrompt(
      article.title,
      article.body,
      article.platform
    );

    // Call LLM
    const response = await generateText(SYSTEM_PROMPT, userPrompt, {
      temperature: options?.temperature ?? 0.7,
      maxTokens: options?.maxTokens ?? 2000,
      timeout: options?.timeout ?? 60000,
    });

    // Parse response
    const { titles, content } = parseGenerationResponse(response);

    // Calculate metrics
    const wordCount = calculateWordCount(content);
    const generationTime = Date.now() - startTime;

    const rewriteArticle: RewriteArticle = {
      id: uuidv4(),
      articleId: article.id,
      titles,
      selectedTitle: titles[0],
      content,
      wordCount,
      generatedAt: new Date().toISOString(),
      generationTime,
      model: 'qwen-plus-2025-07-28',
      status: 'success',
    };

    return rewriteArticle;
  } catch (error) {
    const generationTime = Date.now() - startTime;
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    throw {
      id: uuidv4(),
      articleId: article.id,
      titles: [],
      selectedTitle: '',
      content: '',
      wordCount: 0,
      generatedAt: new Date().toISOString(),
      generationTime,
      model: 'qwen-plus-2025-07-28',
      status: 'failed' as const,
      error: errorMessage,
    };
  }
}

/**
 * Regenerate article (get different version)
 */
export async function regenerateArticle(
  article: ParsedArticle,
  options?: GenerationOptions
): Promise<RewriteArticle> {
  // Use higher temperature for more variation
  return generateArticle(article, {
    ...options,
    temperature: (options?.temperature ?? 0.7) + 0.2,
  });
}
