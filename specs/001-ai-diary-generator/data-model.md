# Data Model: AI Diary Generator

**Phase**: 1 - Design  
**Date**: 2026-04-07  
**Status**: Complete

## Core Entities

### DiaryRequest

Represents a user's request to generate a diary entry.

**Fields**:
- `input: string` - User-provided keyword or description (1-500 characters)
- `timestamp: Date` - When the request was submitted
- `status: 'pending' | 'success' | 'error'` - Request state

**Validation Rules**:
- `input` must not be empty
- `input` must not exceed 500 characters
- `input` must contain at least one non-whitespace character

**TypeScript Definition**:
```typescript
interface DiaryRequest {
  input: string;
  timestamp: Date;
  status: 'pending' | 'success' | 'error';
}
```

### DiaryContent

Represents the AI-generated diary entry.

**Fields**:
- `content: string` - Markdown-formatted diary text
- `generatedAt: Date` - When the content was generated
- `inputKeyword: string` - The keyword/description that generated this content
- `wordCount: number` - Number of words in generated content

**Validation Rules**:
- `content` must not be empty
- `content` must be valid Markdown
- `wordCount` should be 200-500 (informational, not enforced)

**TypeScript Definition**:
```typescript
interface DiaryContent {
  content: string;
  generatedAt: Date;
  inputKeyword: string;
  wordCount: number;
}
```

### DiaryError

Represents an error during diary generation.

**Fields**:
- `code: string` - Error code (e.g., 'EMPTY_INPUT', 'API_TIMEOUT', 'API_ERROR')
- `message: string` - User-friendly error message
- `timestamp: Date` - When the error occurred
- `details?: string` - Technical details (for logging)

**Error Codes**:
- `EMPTY_INPUT` - User submitted empty or whitespace-only input
- `INPUT_TOO_LONG` - Input exceeds 500 characters
- `API_TIMEOUT` - LLM request timed out (>30s)
- `API_ERROR` - LLM API returned error
- `INVALID_RESPONSE` - LLM returned empty or invalid content

**TypeScript Definition**:
```typescript
interface DiaryError {
  code: 'EMPTY_INPUT' | 'INPUT_TOO_LONG' | 'API_TIMEOUT' | 'API_ERROR' | 'INVALID_RESPONSE';
  message: string;
  timestamp: Date;
  details?: string;
}
```

### GenerateDiaryResponse

API response structure for diary generation endpoint.

**Fields**:
- `success: boolean` - Whether generation succeeded
- `data?: DiaryContent` - Generated content (if success)
- `error?: DiaryError` - Error details (if failed)

**TypeScript Definition**:
```typescript
interface GenerateDiaryResponse {
  success: boolean;
  data?: DiaryContent;
  error?: DiaryError;
}
```

## State Management

### Frontend State

**Component State** (React hooks):
```typescript
interface DiaryFormState {
  input: string;
  isLoading: boolean;
  content: DiaryContent | null;
  error: DiaryError | null;
}
```

**State Transitions**:
1. Initial: `{ input: '', isLoading: false, content: null, error: null }`
2. User types: `{ input: 'keyword', isLoading: false, content: null, error: null }`
3. User submits: `{ input: 'keyword', isLoading: true, content: null, error: null }`
4. Success: `{ input: '', isLoading: false, content: {...}, error: null }`
5. Error: `{ input: 'keyword', isLoading: false, content: null, error: {...} }`

## Relationships

```
DiaryRequest
    ↓
    ├─→ DiaryContent (on success)
    └─→ DiaryError (on failure)
```

## Constraints & Rules

1. **Input Validation** (enforced on frontend and backend):
   - Non-empty after trimming
   - Max 500 characters
   - No special character restrictions (support Chinese, emoji, etc.)

2. **Content Generation**:
   - Always returns Markdown format
   - Always includes date header (e.g., `# 2026年4月7日`)
   - Always first-person perspective
   - Always 200-500 words (target, not enforced)

3. **Error Handling**:
   - All errors return user-friendly messages in Chinese
   - Technical errors logged server-side
   - No sensitive information in error messages

4. **Performance**:
   - API timeout: 30 seconds
   - Frontend timeout: 35 seconds (5s buffer)
   - No caching (each request generates new content)

## Type Definitions Summary

```typescript
// lib/types/diary.ts

export interface DiaryRequest {
  input: string;
  timestamp: Date;
  status: 'pending' | 'success' | 'error';
}

export interface DiaryContent {
  content: string;
  generatedAt: Date;
  inputKeyword: string;
  wordCount: number;
}

export type DiaryErrorCode = 
  | 'EMPTY_INPUT' 
  | 'INPUT_TOO_LONG' 
  | 'API_TIMEOUT' 
  | 'API_ERROR' 
  | 'INVALID_RESPONSE';

export interface DiaryError {
  code: DiaryErrorCode;
  message: string;
  timestamp: Date;
  details?: string;
}

export interface GenerateDiaryResponse {
  success: boolean;
  data?: DiaryContent;
  error?: DiaryError;
}
```
