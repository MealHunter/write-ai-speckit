# API Contract: Generate Diary

**Endpoint**: `POST /api/generate-diary`  
**Purpose**: Generate a diary entry based on user input  
**Status**: Specification

## Request

### Method
```
POST /api/generate-diary
```

### Headers
```
Content-Type: application/json
```

### Body

```json
{
  "input": "string (1-500 characters)"
}
```

**Fields**:
- `input` (required, string): User-provided keyword or description for diary generation
  - Min length: 1 character (after trimming whitespace)
  - Max length: 500 characters
  - Supports: Chinese, English, emoji, special characters

### Example Request

```bash
curl -X POST http://localhost:3000/api/generate-diary \
  -H "Content-Type: application/json" \
  -d '{"input": "清明节"}'
```

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "content": "# 2026年4月7日 星期一\n\n今天在想起**清明节**的时候...",
    "generatedAt": "2026-04-07T10:30:00Z",
    "inputKeyword": "清明节",
    "wordCount": 287
  }
}
```

**Fields**:
- `success` (boolean): Always `true` for successful generation
- `data` (object): Generated diary content
  - `content` (string): Markdown-formatted diary entry
  - `generatedAt` (ISO 8601 timestamp): When content was generated
  - `inputKeyword` (string): The input that generated this content
  - `wordCount` (number): Approximate word count of generated content

### Error Response (400 Bad Request)

**Empty Input**:
```json
{
  "success": false,
  "error": {
    "code": "EMPTY_INPUT",
    "message": "请输入至少一个字符",
    "timestamp": "2026-04-07T10:30:00Z"
  }
}
```

**Input Too Long**:
```json
{
  "success": false,
  "error": {
    "code": "INPUT_TOO_LONG",
    "message": "输入内容不能超过500字符",
    "timestamp": "2026-04-07T10:30:00Z"
  }
}
```

### Error Response (500 Internal Server Error)

**API Timeout**:
```json
{
  "success": false,
  "error": {
    "code": "API_TIMEOUT",
    "message": "生成超时，请稍后重试",
    "timestamp": "2026-04-07T10:30:00Z"
  }
}
```

**API Error**:
```json
{
  "success": false,
  "error": {
    "code": "API_ERROR",
    "message": "服务暂时不可用，请稍后重试",
    "timestamp": "2026-04-07T10:30:00Z"
  }
}
```

**Invalid Response**:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_RESPONSE",
    "message": "未能生成内容，请尝试其他关键词",
    "timestamp": "2026-04-07T10:30:00Z"
  }
}
```

## Error Codes

| Code | HTTP Status | Meaning | User Action |
|------|-------------|---------|-------------|
| `EMPTY_INPUT` | 400 | Input is empty or whitespace-only | Enter a keyword or description |
| `INPUT_TOO_LONG` | 400 | Input exceeds 500 characters | Shorten the input |
| `API_TIMEOUT` | 500 | LLM request timed out (>30s) | Try again later |
| `API_ERROR` | 500 | LLM API returned error | Try again later |
| `INVALID_RESPONSE` | 500 | LLM returned empty/invalid content | Try different keywords |

## Behavior

### Request Processing

1. **Validation** (synchronous):
   - Check input is not empty (after trim)
   - Check input length ≤ 500 characters
   - Return 400 error if validation fails

2. **LLM Generation** (asynchronous):
   - Send request to Qwen model via OpenAI SDK
   - Set 30-second timeout
   - Return 500 error if timeout or API error

3. **Response Formatting**:
   - Extract generated text from LLM response
   - Count words in generated content
   - Return 200 with formatted response

### Timeout Behavior

- **Backend timeout**: 30 seconds (LLM call)
- **Frontend timeout**: 35 seconds (HTTP request)
- If timeout occurs, return `API_TIMEOUT` error

### Rate Limiting

- No rate limiting in MVP
- Can be added later if needed

## Content Format

### Generated Diary Format

All generated content follows this structure:

```markdown
# YYYY年M月D日 星期X

[First paragraph - introduction/context]

[Middle paragraphs - main thoughts and reflections]

[Final paragraph - conclusion/reflection]
```

**Markdown Features Used**:
- `#` for date header
- `**text**` for emphasis
- Line breaks for paragraph separation
- Possible: `- ` for lists, `> ` for quotes (if natural)

## Testing

### Happy Path
```
Input: "清明节"
Expected: 200 OK with diary content about Qingming Festival
```

### Edge Cases
```
Input: "" → 400 EMPTY_INPUT
Input: "   " → 400 EMPTY_INPUT
Input: "a" * 501 → 400 INPUT_TOO_LONG
Input: "清明节" (LLM timeout) → 500 API_TIMEOUT
```

## Implementation Notes

- Endpoint is stateless (no session/auth required)
- Each request generates new content (no caching)
- Content is not persisted
- All timestamps in UTC (ISO 8601 format)
- All error messages in Chinese (user-facing)
