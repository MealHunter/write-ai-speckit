/**
 * AI News Rewrite Tool - Type Definitions
 * Defines all entities and interfaces for the news rewrite feature
 */

// ============================================================================
// API Response Wrapper
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
  details?: Record<string, any>;
  timestamp: string;
}

// ============================================================================
// Parsed Article Entity
// ============================================================================

export interface ParsedArticle {
  id: string;
  sourceUrl: string;
  platform: 'wechat' | 'zhihu' | 'news' | 'unknown';
  title: string;
  body: string;
  author?: string;
  publishedAt?: string;
  contentLength: number;
  extractedAt: string;
  language: string;
  status: 'success' | 'partial' | 'failed';
  error?: string;
}

// ============================================================================
// Image Entity
// ============================================================================

export interface Image {
  id: string;
  articleId: string;
  url: string;
  title?: string;
  width?: number;
  height?: number;
  size?: number;
  position: number;
  extractedAt: string;
  status: 'valid' | 'broken' | 'inaccessible';
}

// ============================================================================
// Rewrite Article Entity
// ============================================================================

export interface RewriteArticle {
  id: string;
  articleId: string;
  titles: string[];
  selectedTitle: string;
  content: string;
  wordCount: number;
  generatedAt: string;
  generationTime: number;
  model: string;
  status: 'success' | 'failed' | 'partial';
  error?: string;
}

// ============================================================================
// Generation Attempt Entity
// ============================================================================

export interface GenerationAttempt {
  id: string;
  articleId: string;
  attemptNumber: number;
  prompt: string;
  response: string;
  createdAt: string;
  completedAt: string;
  status: 'success' | 'failed' | 'timeout';
  error?: string;
  inputTokens?: number;
  outputTokens?: number;
}

// ============================================================================
// Parse Request Entity
// ============================================================================

export interface ParseRequest {
  id: string;
  url: string;
  userAgent?: string;
  ipAddress?: string;
  articleId?: string;
  status: 'success' | 'failed' | 'timeout';
  createdAt: string;
  completedAt: string;
  duration: number;
  error?: string;
  errorCode?: string;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface ParseRequestBody {
  url: string;
  timeout?: number;
}

export interface ParseResponse {
  article: ParsedArticle;
  images: Image[];
  status: 'success' | 'partial';
}

export interface GenerateRequestBody {
  articleId: string;
  regenerate?: boolean;
  stream?: boolean;
  wordLimit?: number;
}

export interface GenerateResponse {
  rewriteArticle: RewriteArticle;
  status: 'success' | 'partial';
}

export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: {
    api: 'ok' | 'error';
    llm: 'ok' | 'error' | 'timeout';
    parser: 'ok' | 'error';
  };
  timestamp: string;
}

// ============================================================================
// Error Types
// ============================================================================

export type ErrorCode =
  | 'INVALID_URL'
  | 'URL_NOT_FOUND'
  | 'NETWORK_ERROR'
  | 'PARSE_FAILED'
  | 'NO_CONTENT'
  | 'LLM_UNAVAILABLE'
  | 'LLM_TIMEOUT'
  | 'RATE_LIMIT'
  | 'INTERNAL_ERROR';

export interface ErrorDetails {
  code: ErrorCode;
  message: string;
  statusCode: number;
  details?: Record<string, any>;
}
