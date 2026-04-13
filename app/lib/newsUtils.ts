/**
 * Utility functions for error handling, logging, and common operations
 */

import { ErrorCode, ErrorDetails, ApiResponse } from './types/news';

// ============================================================================
// Error Handling
// ============================================================================

export function createErrorResponse<T>(
  code: ErrorCode,
  message: string,
  statusCode: number,
  details?: Record<string, any>
): ErrorDetails {
  return {
    code,
    message,
    statusCode,
    details,
  };
}

export function mapErrorToUserMessage(code: ErrorCode): string {
  const messages: Record<ErrorCode, string> = {
    INVALID_URL: 'Please check if the link is correct',
    URL_NOT_FOUND: 'This webpage is not supported',
    NETWORK_ERROR: 'Request timeout - please try again',
    PARSE_FAILED: 'Failed to parse content - please try another link',
    NO_CONTENT: 'No valid content retrieved',
    LLM_UNAVAILABLE: 'AI service temporarily unavailable',
    LLM_TIMEOUT: 'Generation timeout - please try again',
    RATE_LIMIT: 'Too many requests - please wait',
    INTERNAL_ERROR: 'Internal server error',
  };

  return messages[code] || 'An error occurred';
}

export function getHttpStatusCode(code: ErrorCode): number {
  const statusCodes: Record<ErrorCode, number> = {
    INVALID_URL: 400,
    URL_NOT_FOUND: 400,
    NETWORK_ERROR: 504,
    PARSE_FAILED: 400,
    NO_CONTENT: 400,
    LLM_UNAVAILABLE: 503,
    LLM_TIMEOUT: 504,
    RATE_LIMIT: 429,
    INTERNAL_ERROR: 500,
  };

  return statusCodes[code] || 500;
}

// ============================================================================
// Logging
// ============================================================================

export interface LogContext {
  requestId?: string;
  userId?: string;
  action?: string;
  duration?: number;
  [key: string]: any;
}

export function log(
  level: 'info' | 'warn' | 'error' | 'debug',
  message: string,
  context?: LogContext
): void {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...context,
  };

  if (level === 'error') {
    console.error(JSON.stringify(logEntry));
  } else if (level === 'warn') {
    console.warn(JSON.stringify(logEntry));
  } else if (level === 'debug') {
    console.debug(JSON.stringify(logEntry));
  } else {
    console.log(JSON.stringify(logEntry));
  }
}

export function logParseStart(url: string, requestId: string): void {
  log('info', 'Parse request started', {
    requestId,
    action: 'parse_start',
    url,
  });
}

export function logParseSuccess(
  url: string,
  duration: number,
  requestId: string
): void {
  log('info', 'Parse request completed', {
    requestId,
    action: 'parse_success',
    url,
    duration,
  });
}

export function logParseError(
  url: string,
  error: string,
  duration: number,
  requestId: string
): void {
  log('error', 'Parse request failed', {
    requestId,
    action: 'parse_error',
    url,
    error,
    duration,
  });
}

export function logGenerateStart(
  articleId: string,
  requestId: string
): void {
  log('info', 'Generate request started', {
    requestId,
    action: 'generate_start',
    articleId,
  });
}

export function logGenerateSuccess(
  articleId: string,
  duration: number,
  requestId: string
): void {
  log('info', 'Generate request completed', {
    requestId,
    action: 'generate_success',
    articleId,
    duration,
  });
}

export function logGenerateError(
  articleId: string,
  error: string,
  duration: number,
  requestId: string
): void {
  log('error', 'Generate request failed', {
    requestId,
    action: 'generate_error',
    articleId,
    error,
    duration,
  });
}

// ============================================================================
// Response Formatting
// ============================================================================

export function createSuccessResponse<T>(
  data: T,
  timestamp: string = new Date().toISOString()
): ApiResponse<T> {
  return {
    success: true,
    data,
    timestamp,
  };
}

export function createErrorResponseBody(
  error: string,
  errorCode?: string,
  details?: Record<string, any>,
  timestamp: string = new Date().toISOString()
): ApiResponse<never> {
  return {
    success: false,
    error,
    errorCode,
    details,
    timestamp,
  };
}

// ============================================================================
// Validation
// ============================================================================

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateArticleId(id: string): boolean {
  // UUID v4 format validation
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

// ============================================================================
// Clipboard Operations
// ============================================================================

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// ============================================================================
// Text Processing
// ============================================================================

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}

export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - remove script tags and event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '');
}
