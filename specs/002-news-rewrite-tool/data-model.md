# Phase 1: Data Model & Entities

**Date**: 2026-04-10  
**Feature**: AI News Rewrite Tool  
**Status**: Complete

## Entity Definitions

### 1. ParsedArticle

Represents the original article extracted from a URL.

```typescript
interface ParsedArticle {
  // Identification
  id: string;                    // UUID or hash of URL
  sourceUrl: string;             // Original URL
  platform: 'wechat' | 'zhihu' | 'news' | 'unknown';  // Detected platform
  
  // Content
  title: string;                 // Article title
  body: string;                  // Article body text (plain text or HTML)
  author?: string;               // Author name if available
  publishedAt?: Date;            // Publication timestamp if available
  
  // Metadata
  extractedAt: Date;             // When content was extracted
  contentLength: number;         // Character count of body
  language: string;              // Detected language (default: 'zh')
  
  // Status
  status: 'success' | 'partial' | 'failed';  // Parsing result
  error?: string;                // Error message if parsing failed
}
```

**Validation Rules**:
- `sourceUrl` must be valid HTTP/HTTPS URL
- `title` must not be empty
- `body` must be at least 50 characters (or status = 'partial')
- `platform` auto-detected from URL domain
- `contentLength` calculated from `body` length

**Relationships**:
- One ParsedArticle → Many Images
- One ParsedArticle → One RewriteArticle (after generation)

---

### 2. Image

Represents an image extracted from the article.

```typescript
interface Image {
  // Identification
  id: string;                    // UUID
  articleId: string;             // Reference to ParsedArticle
  
  // Content
  url: string;                   // Image URL (absolute)
  title?: string;                // Image alt text or caption
  width?: number;                // Image width in pixels
  height?: number;               // Image height in pixels
  size?: number;                 // File size in bytes
  
  // Metadata
  position: number;              // Order in article (0-indexed)
  extractedAt: Date;             // When image was extracted
  
  // Status
  status: 'valid' | 'broken' | 'inaccessible';  // URL validation result
}
```

**Validation Rules**:
- `url` must be valid HTTP/HTTPS URL
- `position` must be non-negative integer
- `status` determined by HEAD request to URL
- Duplicate URLs within same article are deduplicated

**Relationships**:
- Many Images → One ParsedArticle

---

### 3. RewriteArticle

Represents the AI-generated rewritten article.

```typescript
interface RewriteArticle {
  // Identification
  id: string;                    // UUID
  articleId: string;             // Reference to ParsedArticle
  
  // Content
  titles: string[];              // Array of 3 suggested titles
  selectedTitle: string;         // User-selected title (default: titles[0])
  content: string;               // Markdown-formatted article content
  
  // Metadata
  generatedAt: Date;             // When article was generated
  generationTime: number;        // Time taken in milliseconds
  model: string;                 // LLM model used (e.g., 'qwen-plus-2025-07-28')
  
  // Quality Metrics
  wordCount: number;             // Word count of generated content
  readabilityScore?: number;     // Optional: readability metric (0-100)
  
  // Status
  status: 'success' | 'failed' | 'partial';
  error?: string;                // Error message if generation failed
}
```

**Validation Rules**:
- `titles` array must contain exactly 3 non-empty strings
- `content` must be valid Markdown
- `wordCount` calculated from content (approximately 800-1200 words)
- `generationTime` must be positive number
- `selectedTitle` must be one of the titles in array

**Relationships**:
- One RewriteArticle → One ParsedArticle
- One RewriteArticle → Many GenerationAttempts (for regeneration tracking)

---

### 4. GenerationAttempt

Represents each attempt to generate or regenerate an article.

```typescript
interface GenerationAttempt {
  // Identification
  id: string;                    // UUID
  articleId: string;             // Reference to ParsedArticle
  attemptNumber: number;         // 1 for first generation, 2+ for regenerations
  
  // Generation Details
  prompt: string;                // Full prompt sent to LLM
  response: string;              // Raw LLM response
  
  // Metadata
  createdAt: Date;               // When attempt was made
  completedAt: Date;             // When LLM responded
  
  // Status
  status: 'success' | 'failed' | 'timeout';
  error?: string;                // Error message if failed
  
  // Tokens (if available from API)
  inputTokens?: number;
  outputTokens?: number;
}
```

**Validation Rules**:
- `attemptNumber` must be positive integer
- `prompt` and `response` must not be empty on success
- `completedAt` must be after `createdAt`
- Token counts must be non-negative if provided

**Relationships**:
- Many GenerationAttempts → One ParsedArticle
- One GenerationAttempt → One RewriteArticle (on success)

---

### 5. ParseRequest

Represents a user's parse request (for logging and analytics).

```typescript
interface ParseRequest {
  // Identification
  id: string;                    // UUID
  
  // Request Details
  url: string;                   // Input URL
  userAgent?: string;            // Browser user agent
  ipAddress?: string;            // User IP (anonymized)
  
  // Results
  articleId?: string;            // Reference to ParsedArticle if successful
  status: 'success' | 'failed' | 'timeout';
  
  // Metadata
  createdAt: Date;               // When request was made
  completedAt: Date;             // When parsing completed
  duration: number;              // Time taken in milliseconds
  
  // Error Tracking
  error?: string;                // Error message if failed
  errorCode?: string;            // Error code for categorization
}
```

**Validation Rules**:
- `url` must be valid HTTP/HTTPS URL
- `duration` must be positive number
- `completedAt` must be after `createdAt`

**Relationships**:
- One ParseRequest → One ParsedArticle (optional, if successful)

---

## State Transitions

### ParsedArticle Lifecycle

```
[Input URL]
    ↓
[Parsing in Progress]
    ↓
[Success] → status = 'success'
    ↓
[Ready for Generation]
    ↓
[Generation in Progress]
    ↓
[RewriteArticle Created]
```

### RewriteArticle Lifecycle

```
[Generation Requested]
    ↓
[Generating (LLM Call)]
    ↓
[Success] → status = 'success', content populated
    ↓
[Ready for Display/Copy]
    ↓
[User Regenerates?]
    ↓
[New GenerationAttempt Created]
    ↓
[New RewriteArticle Generated]
```

---

## Data Constraints & Validation

| Entity | Field | Constraint | Validation |
|--------|-------|-----------|-----------|
| ParsedArticle | sourceUrl | Required, unique | Valid HTTP/HTTPS URL |
| ParsedArticle | title | Required | Non-empty, max 500 chars |
| ParsedArticle | body | Required | Min 50 chars, max 100k chars |
| ParsedArticle | contentLength | Calculated | body.length |
| Image | url | Required | Valid HTTP/HTTPS URL |
| Image | position | Required | Non-negative integer |
| RewriteArticle | titles | Required | Array of 3 strings, each 50-200 chars |
| RewriteArticle | content | Required | Valid Markdown, 800-1200 words |
| RewriteArticle | wordCount | Calculated | Approximate word count |
| GenerationAttempt | attemptNumber | Required | Positive integer |
| GenerationAttempt | prompt | Required | Non-empty string |
| ParseRequest | duration | Required | Positive number (ms) |

---

## Relationships Diagram

```
ParseRequest
    ↓
ParsedArticle (1)
    ├─→ Image (many)
    ├─→ RewriteArticle (1)
    │   └─→ GenerationAttempt (many)
    └─→ GenerationAttempt (many)
```

---

## Notes for Implementation

1. **No Database Required for v1**: All entities are in-memory or request-scoped. No persistence layer needed.
2. **Serialization**: All entities must be JSON-serializable for API responses.
3. **Timestamps**: Use ISO 8601 format for all Date fields.
4. **IDs**: Use UUID v4 for all entity IDs.
5. **Error Handling**: All entities include `status` and `error` fields for robust error tracking.
6. **Extensibility**: Structure allows easy addition of fields (e.g., user ID, session ID) for future multi-user support.
