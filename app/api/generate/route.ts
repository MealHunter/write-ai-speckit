/**
 * POST /api/generate
 * Generate a rewritten article using LLM
 */

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { GenerateRequestBody, GenerateResponse } from '@/app/lib/types/news';
import { generateArticle, regenerateArticle } from '@/app/lib/llm/generator';
import {
  createSuccessResponse,
  createErrorResponseBody,
  validateArticleId,
  logGenerateStart,
  logGenerateSuccess,
  logGenerateError,
} from '@/app/lib/newsUtils';

// In-memory storage for parsed articles (for MVP)
const articleStore = new Map<string, any>();

export function setArticleInStore(articleId: string, article: any): void {
  articleStore.set(articleId, article);
}

export function getArticleFromStore(articleId: string): any {
  return articleStore.get(articleId);
}

export async function POST(request: NextRequest) {
  const requestId = uuidv4();
  const startTime = Date.now();

  try {
    // Parse request body
    const body: GenerateRequestBody = await request.json();
    const { articleId, regenerate = false, wordLimit = 1000 } = body;

    // Validate articleId
    if (!articleId || typeof articleId !== 'string') {
      return NextResponse.json(
        createErrorResponseBody(
          'Article not found or already expired',
          'INVALID_URL'
        ),
        { status: 400 }
      );
    }

    logGenerateStart(articleId, requestId);

    // Retrieve article from store
    const article = getArticleFromStore(articleId);
    if (!article) {
      logGenerateError(
        articleId,
        'Article not found',
        Date.now() - startTime,
        requestId
      );
      return NextResponse.json(
        createErrorResponseBody(
          'Article not found or already expired',
          'INVALID_URL'
        ),
        { status: 400 }
      );
    }

    // Validate article content
    if (!article.body || article.body.length < 50) {
      logGenerateError(
        articleId,
        'Invalid article content',
        Date.now() - startTime,
        requestId
      );
      return NextResponse.json(
        createErrorResponseBody(
          'Cannot generate - original content invalid',
          'PARSE_FAILED'
        ),
        { status: 400 }
      );
    }

    // Generate article
    let rewriteArticle;
    try {
      if (regenerate) {
        rewriteArticle = await regenerateArticle(article, {
          timeout: 60000,
          wordLimit,
        });
      } else {
        rewriteArticle = await generateArticle(article, {
          timeout: 60000,
          wordLimit,
        });
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Generation failed';
      console.error('LLM Generation Error:', {
        error: error,
        message: errorMessage,
        stack: error?.stack,
      });

      if (errorMessage.includes('timeout')) {
        logGenerateError(
          articleId,
          'LLM timeout',
          Date.now() - startTime,
          requestId
        );
        return NextResponse.json(
          createErrorResponseBody(
            'Generation timeout - please try again',
            'LLM_TIMEOUT'
          ),
          { status: 504 }
        );
      }

      logGenerateError(
        articleId,
        errorMessage,
        Date.now() - startTime,
        requestId
      );
      return NextResponse.json(
        createErrorResponseBody(
          'AI service temporarily unavailable',
          'LLM_UNAVAILABLE'
        ),
        { status: 503 }
      );
    }

    // Check for generation errors
    if (rewriteArticle.status === 'failed') {
      logGenerateError(
        articleId,
        rewriteArticle.error || 'Unknown error',
        Date.now() - startTime,
        requestId
      );
      return NextResponse.json(
        createErrorResponseBody(
          'AI service temporarily unavailable',
          'LLM_UNAVAILABLE'
        ),
        { status: 503 }
      );
    }

    const response: GenerateResponse = {
      rewriteArticle,
      status: rewriteArticle.status,
    };

    logGenerateSuccess(articleId, Date.now() - startTime, requestId);

    return NextResponse.json(createSuccessResponse(response), { status: 200 });
  } catch (error: any) {
    const errorMessage = error?.message || 'Internal server error';
    logGenerateError('unknown', errorMessage, Date.now() - startTime, requestId);

    return NextResponse.json(
      createErrorResponseBody(
        'Internal server error',
        'INTERNAL_ERROR'
      ),
      { status: 500 }
    );
  }
}
