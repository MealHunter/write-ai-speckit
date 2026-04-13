# AI News Rewrite Tool - Quick Start Guide

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your DASHSCOPE_API_KEY
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Main app: http://localhost:3000
   - News Rewrite Tool: http://localhost:3000/news-rewrite

## API Endpoints

### 1. Parse Article
```bash
curl -X POST http://localhost:3000/api/parse \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://mp.weixin.qq.com/s/e_zUvjW1ruu7JTBGY_TILA",
    "timeout": 30
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "article": {
      "id": "uuid",
      "sourceUrl": "...",
      "platform": "wechat",
      "title": "Article Title",
      "body": "Article content...",
      "author": "Author Name",
      "publishedAt": "2026-04-10T10:30:00Z",
      "contentLength": 2500,
      "extractedAt": "2026-04-10T12:00:00Z",
      "language": "zh",
      "status": "success"
    },
    "images": [
      {
        "id": "uuid",
        "articleId": "uuid",
        "url": "https://...",
        "title": "Image title",
        "position": 0,
        "extractedAt": "2026-04-10T12:00:00Z",
        "status": "valid"
      }
    ],
    "status": "success"
  },
  "timestamp": "2026-04-10T12:00:00Z"
}
```

### 2. Generate Article
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "articleId": "550e8400-e29b-41d4-a716-446655440000",
    "regenerate": false
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "rewriteArticle": {
      "id": "uuid",
      "articleId": "uuid",
      "titles": [
        "Title Option 1",
        "Title Option 2",
        "Title Option 3"
      ],
      "selectedTitle": "Title Option 1",
      "content": "# Title\n\n## Section\n\nContent...",
      "wordCount": 850,
      "generatedAt": "2026-04-10T12:05:00Z",
      "generationTime": 8500,
      "model": "qwen-plus-2025-07-28",
      "status": "success"
    },
    "status": "success"
  },
  "timestamp": "2026-04-10T12:05:00Z"
}
```

### 3. Health Check
```bash
curl http://localhost:3000/api/health
```

**Response**:
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

## Testing URLs

### WeChat Official Account
- Format: `https://mp.weixin.qq.com/s/[article-id]`
- Example: `https://mp.weixin.qq.com/s/e_zUvjW1ruu7JTBGY_TILA`

### Zhihu
- Format: `https://www.zhihu.com/question/[question-id]/answer/[answer-id]`
- Example: `https://www.zhihu.com/question/123456789/answer/987654321`

### Generic News
- CNN: `https://www.cnn.com/...`
- BBC: `https://www.bbc.com/...`
- Reuters: `https://www.reuters.com/...`

## UI Workflow

1. **Navigate to** `/news-rewrite`
2. **Enter URL** in the input field
3. **Click "Parse & Generate"** button
4. **Wait for loading** (typically 30-60 seconds)
5. **View results**:
   - Original Content (collapsible)
   - Original Images (with preview/download)
   - AI Rewritten Article (with title selection)
6. **Actions**:
   - Copy article to clipboard
   - Regenerate for different version
   - Process another article

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| "Please check if the link is correct" | Invalid URL format | Verify URL is valid HTTP/HTTPS |
| "This webpage is not supported" | Page not found (404) | Check URL is accessible |
| "Request timeout - please try again" | Network timeout | Try again, check internet connection |
| "No valid content retrieved" | No article content found | Ensure URL points to article content |
| "AI service temporarily unavailable" | LLM service down | Check DASHSCOPE_API_KEY, try again |
| "Generation timeout - please try again" | LLM took too long | Try again, article may be too long |

## Troubleshooting

### DASHSCOPE_API_KEY not set
```
Error: DASHSCOPE_API_KEY is not set
```
**Solution**: Add `DASHSCOPE_API_KEY=sk-...` to `.env.local`

### Module not found errors
```
Error: Cannot find module 'cheerio'
```
**Solution**: Run `npm install` to install dependencies

### Port 3000 already in use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution**: Kill process on port 3000 or use different port:
```bash
npm run dev -- -p 3001
```

### Image loading fails
- Images may be blocked by CORS
- Some images may require authentication
- Check browser console for specific errors

## Development

### File Structure
```
app/
├── news-rewrite/page.tsx       # Main UI page
├── api/
│   ├── parse/route.ts          # Parse endpoint
│   ├── generate/route.ts       # Generate endpoint
│   └── health/route.ts         # Health check
├── components/
│   ├── URLInput.tsx
│   ├── NewsLoadingState.tsx
│   ├── OriginalContent.tsx
│   ├── ImageGallery.tsx
│   ├── RewriteArticle.tsx
│   └── NewsErrorMessage.tsx
└── lib/
    ├── types/news.ts           # Type definitions
    ├── llm/
    │   ├── newsClient.ts       # LLM client
    │   ├── newsPrompts.ts      # Prompts
    │   └── generator.ts        # Generation service
    ├── parsers/
    │   ├── index.ts            # Factory
    │   ├── wechat.ts
    │   ├── zhihu.ts
    │   └── news.ts
    └── newsUtils.ts            # Utilities
```

### Adding New Parser
1. Create `app/lib/parsers/[platform].ts`
2. Implement `BaseParser` interface
3. Add platform detection in `app/lib/parsers/index.ts`
4. Export from `getParser()` function

### Customizing Prompts
Edit `app/lib/llm/newsPrompts.ts`:
- `SYSTEM_PROMPT` - System role and instructions
- `createParsePrompt()` - User prompt template
- `parseGenerationResponse()` - Response parsing logic

## Performance Notes

- **Parse time**: 5-15 seconds (depends on page size)
- **Generate time**: 20-60 seconds (depends on content length)
- **Total time**: 30-90 seconds per article
- **Image extraction**: Typically 0.5-2 seconds
- **Memory usage**: ~50-100MB per request

## Security Considerations

- URLs are validated before fetching
- HTML is parsed safely with cheerio
- No user data is persisted (MVP)
- API responses are JSON-safe
- No authentication required (MVP)

## Next Steps

1. Test with real WeChat and Zhihu links
2. Verify image extraction works
3. Check article generation quality
4. Test error scenarios
5. Optimize performance if needed
6. Add database persistence (Phase 4+)
7. Implement user authentication (Phase 4+)
8. Add rate limiting (Phase 4+)
