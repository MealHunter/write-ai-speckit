/**
 * POST /api/parse
 * Parse a URL and extract article content and images
 */

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ParseRequestBody, ParseResponse } from '@/app/lib/types/news';
import { parseUrl, detectPlatform, isValidUrl } from '@/app/lib/parsers/index';
import {
  createSuccessResponse,
  createErrorResponseBody,
  validateUrl,
  logParseStart,
  logParseSuccess,
  logParseError,
} from '@/app/lib/newsUtils';
import { setArticleInStore } from '@/app/api/generate/route';

const DEFAULT_TIMEOUT = 30000; // 30 seconds
const MAX_TIMEOUT = 60000; // 60 seconds

export async function POST(request: NextRequest) {
  const requestId = uuidv4();
  const startTime = Date.now();

  try {
    // Parse request body
    const body: ParseRequestBody = await request.json();
    const { url, timeout = DEFAULT_TIMEOUT } = body;

    // Validate URL
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        createErrorResponseBody(
          'Please check if the link is correct',
          'INVALID_URL'
        ),
        { status: 400 }
      );
    }

    if (!validateUrl(url)) {
      return NextResponse.json(
        createErrorResponseBody(
          'Please check if the link is correct',
          'INVALID_URL'
        ),
        { status: 400 }
      );
    }

    // Validate timeout
    const finalTimeout = Math.min(timeout, MAX_TIMEOUT);

    logParseStart(url, requestId);

    // Fetch HTML content
    let html: string;
    try {
      const response = await axios.get(url, {
        timeout: finalTimeout,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        maxRedirects: 5,
      });

      html = response.data;

      if (!html || html.length === 0) {
        logParseError(url, 'Empty response', Date.now() - startTime, requestId);
        return NextResponse.json(
          createErrorResponseBody(
            'This webpage is not supported',
            'URL_NOT_FOUND'
          ),
          { status: 400 }
        );
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Network error';

      if (error?.response?.status === 404) {
        logParseError(
          url,
          'Page not found',
          Date.now() - startTime,
          requestId
        );
        return NextResponse.json(
          createErrorResponseBody(
            'This webpage is not supported',
            'URL_NOT_FOUND'
          ),
          { status: 400 }
        );
      }

      if (error?.code === 'ECONNABORTED' || error?.code === 'ETIMEDOUT') {
        logParseError(
          url,
          'Request timeout',
          Date.now() - startTime,
          requestId
        );
        return NextResponse.json(
          createErrorResponseBody(
            'Request timeout - please try again',
            'NETWORK_ERROR'
          ),
          { status: 504 }
        );
      }

      logParseError(url, errorMessage, Date.now() - startTime, requestId);
      return NextResponse.json(
        createErrorResponseBody(
          'Request timeout - please try again',
          'NETWORK_ERROR'
        ),
        { status: 504 }
      );
    }

    // Parse content
    let parseResult;
    try {
      parseResult = await parseUrl(url, html);
    } catch (error: any) {
      const errorMessage = error?.message || 'Parse failed';
      logParseError(url, errorMessage, Date.now() - startTime, requestId);
      return NextResponse.json(
        createErrorResponseBody(
          'No valid content retrieved',
          'PARSE_FAILED'
        ),
        { status: 400 }
      );
    }

    // Validate parsed content
    if (!parseResult.article.body || parseResult.article.body.length < 50) {
      logParseError(
        url,
        'Insufficient content',
        Date.now() - startTime,
        requestId
      );
      return NextResponse.json(
        createErrorResponseBody(
          'No valid content retrieved',
          'NO_CONTENT'
        ),
        { status: 400 }
      );
    }

    // Set article IDs for images
    const images = parseResult.images.map((img) => ({
      ...img,
      articleId: parseResult.article.id,
    }));

    const response: ParseResponse = {
      article: parseResult.article,
      images,
      status: parseResult.article.status === 'failed' ? 'partial' : parseResult.article.status,
    };

    // Store article for generation
    setArticleInStore(parseResult.article.id, parseResult.article);

    logParseSuccess(url, Date.now() - startTime, requestId);

    return NextResponse.json(createSuccessResponse(response), { status: 200 });
  } catch (error: any) {
    const errorMessage = error?.message || 'Internal server error';
    logParseError('unknown', errorMessage, Date.now() - startTime, requestId);

    return NextResponse.json(
      createErrorResponseBody(
        'Internal server error',
        'INTERNAL_ERROR'
      ),
      { status: 500 }
    );
  }
}
