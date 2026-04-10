# API Contracts: AI News Rewrite Tool

**Date**: 2026-04-10  
**Feature**: AI News Rewrite Tool  
**Status**: Complete

## Overview

This document defines the API contracts for the AI News Rewrite Tool. All endpoints follow Next.js API Routes conventions and return consistent JSON response structures.

## Response Format

All API responses follow this standard structure:

```typescript
interface ApiResponse<T> {
  success: boolean;              // true if operation succeeded
  data?: T;                      // Response data (only if success = true)
  error?: string;                // Error message (only if success = false)
  timestamp: string;             // ISO 8601 timestamp
}
```

## HTTP Status Codes

- `200 OK`: Request succeeded
- `400 Bad Request`: Invalid input or validation error
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error
- `503 Service Unavailable`: LLM service unavailable

---

## Endpoint 1: Parse Article

**Path**: `POST /api/parse`

**Purpose**: Parse a URL and extract article content and images.

### Request

```typescript
interface ParseRequest {
  url: string;                   // Article URL (required)
  timeout?: number;              // Timeout in seconds (default: 30, max: 60)
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/parse \
  -H "Content-Type: application/json" \
  -d '{"url": "https://mp.weixin.qq.com/s/e_zUvjW1ruu7JTBGY_TILA"}'
```

### Response (Success)

```typescript
interface ParseResponse {
  article: {
    id: string;                  // UUID
    sourceUrl: string;
    platform: 'wechat' | 'zhihu' | 'news' | 'unknown';
    title: string;
    body: string;                // Plain text content
    author?: string;
    publishedAt?: string;        // ISO 8601
    contentLength: number;
    extractedAt: string;         // ISO 8601
  };
  images: Array<{
    id: string;
    url: string;
    title?: string;
    position: number;
    status: 'valid' | 'broken' | 'inaccessible';
  }>;
  status: 'success' | 'partial';  // 'partial' if some content extracted but incomplete
}
```

**Example**:
```json
{
  "success": true,
  "data": {
    "article": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "sourceUrl": "https://mp.weixin.qq.com/s/e_zUvjW1ruu7JTBGY_TILA",
      "platform": "wechat",
      "title": "Breaking News: Tech Company Announces New Product",
      "body": "Lorem ipsum dolor sit amet...",
      "author": "John Doe",
      "publishedAt": "2026-04-10T10:30:00Z",
      "contentLength": 2500,
      "extractedAt": "2026-04-10T12:00:00Z"
    },
    "images": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "url": "https://example.com/image1.jpg",
        "title": "Product Launch",
        "position": 0,
        "status": "valid"
      }
    ],
    "status": "success"
  },
  "timestamp": "2026-04-10T12:00:00Z"
}
```

### Response (Error)

```json
{
  "success": false,
  "error": "Please check if the link is correct",
  "timestamp": "2026-04-10T12:00:00Z"
}
```

### Error Scenarios

| Scenario | HTTP Status | Error Message |
|----------|-------------|---------------|
| Invalid URL format | 400 | "Please check if the link is correct" |
| URL not found (404) | 400 | "This webpage is not supported" |
| Network timeout | 504 | "Request timeout - please try again" |
| No content extracted | 400 | "No valid content retrieved" |
| Rate limit exceeded | 429 | "Too many requests - please wait" |
| Server error | 500 | "Internal server error" |

---

## Endpoint 2: Generate Article

**Path**: `POST /api/generate`

**Purpose**: Generate a rewritten article using LLM based on parsed content.

### Request

```typescript
interface GenerateRequest {
  articleId: string;             // ID from parse response (required)
  regenerate?: boolean;          // true to generate new version (default: false)
  stream?: boolean;              // true to stream response (default: false)
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"articleId": "550e8400-e29b-41d4-a716-446655440000"}'
```

### Response (Success)

```typescript
interface GenerateResponse {
  rewriteArticle: {
    id: string;                  // UUID
    articleId: string;
    titles: string[];            // Array of 3 suggested titles
    selectedTitle: string;       // Default: titles[0]
    content: string;             // Markdown-formatted article
    wordCount: number;
    generatedAt: string;         // ISO 8601
    generationTime: number;      // Milliseconds
    model: string;               // e.g., 'qwen-plus-2025-07-28'
  };
  status: 'success' | 'partial';
}
```

**Example**:
```json
{
  "success": true,
  "data": {
    "rewriteArticle": {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "articleId": "550e8400-e29b-41d4-a716-446655440000",
      "titles": [
        "Tech Giant Shocks Industry with Unexpected Product Launch",
        "What Everyone Missed About the New Product Announcement",
        "Industry Insiders React: Is This a Game Changer?"
      ],
      "selectedTitle": "Tech Giant Shocks Industry with Unexpected Product Launch",
      "content": "# Tech Giant Shocks Industry with Unexpected Product Launch\n\n## The Announcement That Changed Everything\n\nYesterday morning, the tech world was set ablaze...",
      "wordCount": 850,
      "generatedAt": "2026-04-10T12:05:00Z",
      "generationTime": 8500,
      "model": "qwen-plus-2025-07-28"
    },
    "status": "success"
  },
  "timestamp": "2026-04-10T12:05:00Z"
}
```

### Response (Streaming)

When `stream: true`, response is Server-Sent Events (SSE):

```
data: {"type": "title", "value": "Tech Giant Shocks Industry..."}
data: {"type": "content_chunk", "value": "# Tech Giant Shocks Industry...\n\n## The Announcement"}
data: {"type": "content_chunk", "value": " That Changed Everything\n\nYesterday morning..."}
data: {"type": "complete", "value": {"id": "...", "wordCount": 850}}
```

### Response (Error)

```json
{
  "success": false,
  "error": "Article not found or already expired",
  "timestamp": "2026-04-10T12:05:00Z"
}
```

### Error Scenarios

| Scenario | HTTP Status | Error Message |
|----------|-------------|---------------|
| Invalid articleId | 400 | "Article not found or already expired" |
| Article parsing failed | 400 | "Cannot generate - original content invalid" |
| LLM service unavailable | 503 | "AI service temporarily unavailable" |
| LLM timeout | 504 | "Generation timeout - please try again" |
| Rate limit exceeded | 429 | "Too many requests - please wait" |
| Server error | 500 | "Internal server error" |

---

## Endpoint 3: Health Check

**Path**: `GET /api/health`

**Purpose**: Check API and LLM service health.

### Response (Success)

```typescript
interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: {
    api: 'ok' | 'error';
    llm: 'ok' | 'error' | 'timeout';
    parser: 'ok' | 'error';
  };
  timestamp: string;
}
```

**Example**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "services": {
      "api": "ok",
      "llm": "ok",
      "parser": "ok"
    },
    "timestamp": "2026-04-10T12:00:00Z"
  },
  "timestamp": "2026-04-10T12:00:00Z"
}
```

---

## Rate Limiting

All endpoints are rate-limited:

- **Per IP**: 10 requests/second
- **Per endpoint**: 100 requests/minute
- **Queue timeout**: 5 minutes

Rate limit headers:

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1712750460
```

---

## Error Handling

All errors follow this format:

```typescript
interface ErrorResponse {
  success: false;
  error: string;                 // User-friendly error message
  errorCode?: string;            // Machine-readable code
  details?: Record<string, any>; // Additional context
  timestamp: string;
}
```

**Error Codes**:
- `INVALID_URL`: URL format invalid
- `URL_NOT_FOUND`: Page not found (404)
- `NETWORK_ERROR`: Network connectivity issue
- `PARSE_FAILED`: Content extraction failed
- `NO_CONTENT`: No valid content extracted
- `LLM_UNAVAILABLE`: LLM service down
- `LLM_TIMEOUT`: LLM generation timeout
- `RATE_LIMIT`: Rate limit exceeded
- `INTERNAL_ERROR`: Server error

---

## Timeout Specifications

| Operation | Timeout | Notes |
|-----------|---------|-------|
| URL fetch | 30s | Configurable via request |
| HTML parsing | 5s | Per-platform parser |
| LLM generation | 60s | Includes queue wait |
| Total request | 90s | Hard limit |

---

## Request/Response Size Limits

| Field | Max Size | Notes |
|-------|----------|-------|
| URL | 2048 bytes | Standard URL limit |
| Article body | 100 KB | Plain text |
| Generated content | 50 KB | Markdown |
| Image URL | 2048 bytes | Per image |
| Total response | 1 MB | Compressed |

---

## Authentication & Security

**v1 Scope**: No authentication required (single-user MVP)

**Future Considerations**:
- API key authentication for multi-user
- Rate limiting per user
- Request signing for sensitive operations
- CORS configuration for frontend

---

## Testing Endpoints

For development and testing:

```bash
# Test parsing
curl -X POST http://localhost:3000/api/parse \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/article"}'

# Test generation
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"articleId": "test-id"}'

# Test health
curl http://localhost:3000/api/health
```
