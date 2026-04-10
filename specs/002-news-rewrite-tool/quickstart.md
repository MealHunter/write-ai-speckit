# Quickstart Guide: AI News Rewrite Tool

**Date**: 2026-04-10  
**Feature**: AI News Rewrite Tool  
**Status**: Complete

## Prerequisites

- Node.js 18+ and npm/yarn
- TypeScript 5+
- Aliyun Dashscope API key (get from https://dashscope.aliyuncs.com)
- Git

## Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repo-url>
cd write-ai-speckit

# Install dependencies
npm install

# Or with yarn
yarn install
```

### 2. Configure Environment Variables

Create `.env.local` in the project root:

```bash
# Aliyun Dashscope API Configuration
DASHSCOPE_API_KEY=sk-your-api-key-here

# Optional: LLM Model (default: qwen-plus-2025-07-28)
DASHSCOPE_MODEL=qwen-plus-2025-07-28

# Optional: API Base URL (default: https://dashscope.aliyuncs.com/compatible-mode/v1)
DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1

# Optional: Request Timeout (default: 60000ms)
REQUEST_TIMEOUT=60000

# Optional: Rate Limit (default: 10 requests/second)
RATE_LIMIT_PER_SECOND=10
```

### 3. Install shadcn/ui Components

```bash
# Initialize shadcn/ui (if not already done)
npx shadcn-ui@latest init

# Add required components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add tabs
```

### 4. Install Additional Dependencies

```bash
# HTML parsing
npm install cheerio axios

# LLM integration
npm install openai

# Request queuing
npm install p-queue

# Markdown rendering
npm install react-markdown

# Utilities
npm install uuid clsx class-variance-authority

# Dev dependencies
npm install --save-dev @types/node @types/react typescript
```

## Project Structure

```
app/
├── api/
│   ├── parse/route.ts          # POST /api/parse
│   ├── generate/route.ts       # POST /api/generate
│   └── health/route.ts         # GET /api/health
├── components/
│   ├── URLInput.tsx
│   ├── ParseButton.tsx
│   ├── LoadingState.tsx
│   ├── OriginalContent.tsx
│   ├── ImageGallery.tsx
│   ├── RewriteArticle.tsx
│   ├── CopyButton.tsx
│   ├── RegenerateButton.tsx
│   └── ErrorMessage.tsx
├── layout.tsx
├── page.tsx
└── globals.css

lib/
├── parsers/
│   ├── wechat.ts
│   ├── zhihu.ts
│   ├── news.ts
│   └── index.ts
├── llm/
│   ├── client.ts
│   ├── prompts.ts
│   └── generator.ts
├── types.ts
└── utils.ts

tests/
├── unit/
├── integration/
└── fixtures/
```

## Development Workflow

### 1. Start Development Server

```bash
npm run dev
# or
yarn dev
```

Server runs at `http://localhost:3000`

### 2. Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- parsers.test.ts

# Watch mode
npm test -- --watch
```

### 3. Build for Production

```bash
npm run build
npm start
```

## Key Implementation Files

### API Routes

**`app/api/parse/route.ts`**:
- Validates URL input
- Detects platform (WeChat, Zhihu, news)
- Extracts content and images using appropriate parser
- Returns ParsedArticle + Images

**`app/api/generate/route.ts`**:
- Receives articleId from parse response
- Calls Aliyun Dashscope API with crafted prompt
- Returns RewriteArticle with 3 titles and Markdown content
- Supports streaming responses

**`app/api/health/route.ts`**:
- Checks API health
- Verifies LLM service connectivity
- Returns service status

### Parsers

**`lib/parsers/wechat.ts`**:
- Extracts from WeChat Official Account HTML
- Targets `.js-article-content` or similar selectors
- Handles WeChat-specific image formats

**`lib/parsers/zhihu.ts`**:
- Extracts from Zhihu answer pages
- Targets answer content containers
- Handles Zhihu image CDN URLs

**`lib/parsers/news.ts`**:
- Generic parser for common news websites
- Tries multiple common selectors
- Fallback to article/main/content tags

### LLM Integration

**`lib/llm/client.ts`**:
```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});
```

**`lib/llm/prompts.ts`**:
- System prompt: WeChat expert persona
- User prompt: Original content + requirements
- Output format: Markdown with 3 titles, ~800 words

**`lib/llm/generator.ts`**:
- Calls OpenAI client with prompts
- Handles streaming responses
- Parses LLM output into structured format

### Frontend Components

**`app/page.tsx`**:
- Main page layout
- Manages state: URL input → parsing → generation → display

**`app/components/URLInput.tsx`**:
- Input field for article URL
- URL validation on blur

**`app/components/ParseButton.tsx`**:
- Triggers parse API call
- Shows loading state
- Handles errors

**`app/components/RewriteArticle.tsx`**:
- Displays generated article
- Renders Markdown content
- Shows word count and generation time

**`app/components/CopyButton.tsx`**:
- Copies article to clipboard
- Shows success/error toast

## Testing Strategy

### Unit Tests

```bash
# Test parsers with mock HTML
npm test -- parsers.test.ts

# Test LLM prompt generation
npm test -- generator.test.ts

# Test utilities
npm test -- utils.test.ts
```

### Integration Tests

```bash
# Test API endpoints
npm test -- api.test.ts

# Test complete workflow
npm test -- e2e.test.ts
```

### Manual Testing

1. **Parse WeChat Article**:
   - Input: `https://mp.weixin.qq.com/s/e_zUvjW1ruu7JTBGY_TILA`
   - Verify: Content extracted, images displayed

2. **Parse Zhihu Answer**:
   - Input: `https://www.zhihu.com/question/xxx/answer/xxx`
   - Verify: Answer content extracted

3. **Generate Article**:
   - After parsing, click "Parse and Generate"
   - Verify: 3 titles generated, Markdown content displayed

4. **Copy and Regenerate**:
   - Click copy button, verify clipboard
   - Click regenerate, verify new content generated

## Common Issues & Troubleshooting

### Issue: "DASHSCOPE_API_KEY not found"

**Solution**: Ensure `.env.local` exists and contains valid API key:
```bash
echo "DASHSCOPE_API_KEY=sk-your-key" > .env.local
```

### Issue: "This webpage is not supported"

**Solution**: 
- Verify URL is accessible (not behind login)
- Check if website structure matches parser expectations
- Try generic news parser as fallback

### Issue: LLM Generation Timeout

**Solution**:
- Increase `REQUEST_TIMEOUT` in `.env.local`
- Check Aliyun API quota and rate limits
- Verify network connectivity

### Issue: Tests Failing

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Run tests with verbose output
npm test -- --verbose
```

## Performance Optimization

### Caching

- Cache parsed content for 1 hour (optional)
- Deduplicate concurrent requests for same URL
- Use HTTP caching headers

### Streaming

- Stream LLM responses to frontend in real-time
- Show progressive content generation
- Improve perceived performance

### Rate Limiting

- Implement request queuing (p-queue)
- Limit to 10 requests/second per IP
- Return 429 when queue full

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# DASHSCOPE_API_KEY=sk-your-key
```

### Self-Hosted (Node.js)

```bash
# Build
npm run build

# Start
npm start

# Or use PM2
pm2 start npm --name "news-rewrite" -- start
```

## Next Steps

1. **Implement API Routes**: Start with `/api/parse` endpoint
2. **Implement Parsers**: Create parser modules for each platform
3. **Implement LLM Integration**: Set up Dashscope client and prompts
4. **Build Frontend**: Create React components with shadcn/ui
5. **Add Tests**: Write unit and integration tests
6. **Deploy**: Push to Vercel or self-hosted environment

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Aliyun Dashscope API](https://dashscope.aliyuncs.com)
- [OpenAI SDK](https://github.com/openai/node-sdk)
- [Cheerio Documentation](https://cheerio.js.org)

## Support

For issues or questions:
1. Check this quickstart guide
2. Review API contracts in `contracts/api.md`
3. Check data model in `data-model.md`
4. Review research findings in `research.md`
