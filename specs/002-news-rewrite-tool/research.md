# Phase 0: Research & Technical Decisions

**Date**: 2026-04-10  
**Feature**: AI News Rewrite Tool  
**Status**: Complete - All clarifications resolved

## Research Findings

### 1. Web Scraping & HTML Parsing

**Decision**: Use Cheerio for HTML parsing with axios for HTTP requests

**Rationale**:
- Cheerio provides jQuery-like API for DOM traversal, familiar to most developers
- Lightweight and fast for server-side parsing
- Works well with Next.js API Routes
- No browser automation needed for static content extraction

**Alternatives Considered**:
- Puppeteer: Overkill for static content, slower, higher memory usage
- jsdom: Heavier than Cheerio, unnecessary for parsing-only use case
- Playwright: Better for E2E testing, not ideal for production scraping

**Implementation**: Create parser modules for each platform (WeChat, Zhihu, generic news) using Cheerio selectors

---

### 2. LLM Integration: Aliyun Dashscope vs OpenAI

**Decision**: Use Aliyun Dashscope API with Qwen Plus 2025-07-28 model via OpenAI SDK

**Rationale**:
- User explicitly specified Aliyun Dashscope with OpenAI SDK compatibility
- Qwen Plus model optimized for Chinese content generation
- OpenAI SDK provides familiar interface and error handling
- Cost-effective for Chinese market
- Supports streaming for real-time response display

**Implementation Details**:
```typescript
const openai = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});
```

**Prompt Engineering**:
- System role: "You are a 500k+ follower WeChat Official Account expert..."
- User prompt includes original content and specific requirements
- Output format: Markdown with 3 titles, clear structure, ~800 words
- Tone: Conversational, engaging, human-like (avoid "AI taste")

---

### 3. Frontend Component Library

**Decision**: shadcn/ui + Tailwind CSS for all UI components

**Rationale**:
- Aligns with project constitution (Principle VII)
- shadcn/ui provides accessible, customizable components
- Tailwind CSS enables rapid styling without custom CSS
- Both are industry standard for modern React applications
- Excellent TypeScript support

**Components to Use**:
- Input: URL input field
- Button: Parse and Generate, Copy, Regenerate
- Card: Content sections (Original, Images, Rewritten)
- Skeleton: Loading state
- Alert: Error messages
- Dialog: Image preview
- Tabs: Optional content organization

---

### 4. Content Parsing Strategy

**Decision**: Platform-specific parsers with fallback to generic extraction

**Rationale**:
- WeChat and Zhihu have distinct HTML structures requiring targeted selectors
- Generic parser handles common news websites
- Fallback mechanism improves robustness
- Easier to maintain and extend

**Parser Implementation**:
- WeChat: Extract from `.js-article-content` or similar selectors
- Zhihu: Extract from answer content containers
- Generic: Extract from common article tags (article, main, .content, etc.)
- Image extraction: Collect all img tags with src attributes

---

### 5. Error Handling & User Feedback

**Decision**: Graceful degradation with clear error messages

**Rationale**:
- Spec requires specific error messages for different failure scenarios
- Users need actionable feedback
- Fallback option (generate without parsing) improves UX

**Error Scenarios**:
1. Invalid URL format → "Please check if the link is correct"
2. Network error / page not found → "This webpage is not supported"
3. No content extracted → "No valid content retrieved"
4. LLM generation fails → Offer retry or fallback

---

### 6. Performance Optimization

**Decision**: Implement request timeout, streaming responses, and caching headers

**Rationale**:
- Spec requires 60-second total generation time
- LLM calls are inherently slow; streaming improves perceived performance
- Caching prevents redundant API calls for same URL

**Implementation**:
- HTTP timeout: 30 seconds for parsing, 60 seconds for generation
- Stream LLM response to frontend in real-time
- Cache parsed content for 1 hour (optional for v1)
- Implement request deduplication for concurrent identical requests

---

### 7. Image Handling

**Decision**: Direct linking to original URLs, no local storage for v1

**Rationale**:
- Spec assumes no persistence layer for v1
- Reduces server storage requirements
- Simplifies deployment
- Original images remain accessible as long as source is available

**Implementation**:
- Extract image URLs from parsed content
- Validate URLs (check for 404, etc.)
- Display with preview and download links
- Download links use `<a href>` with `download` attribute

---

### 8. Markdown Output

**Decision**: Generate Markdown on backend, render on frontend with markdown-to-react library

**Rationale**:
- LLM naturally outputs Markdown
- Frontend can render with react-markdown or similar
- Preserves formatting (headers, lists, emphasis)
- Easy to copy and paste to WeChat Official Account

**Implementation**:
- LLM generates Markdown with ## headers, bold, lists
- Frontend uses `react-markdown` to render
- Copy button copies raw Markdown text
- Optional: Provide HTML export for direct WeChat paste

---

### 9. Concurrency & Rate Limiting

**Decision**: Implement request queuing and rate limiting on backend

**Rationale**:
- Spec requires support for 100 concurrent users
- Aliyun API has rate limits
- Prevent overwhelming third-party websites

**Implementation**:
- Use `p-queue` for request queuing
- Rate limit: 10 requests/second per IP
- Queue timeout: 5 minutes
- Return 429 (Too Many Requests) when queue full

---

### 10. Testing Strategy

**Decision**: Unit tests for parsers/LLM, integration tests for API, E2E tests for workflows

**Rationale**:
- Constitution requires 80% coverage
- Parsers need isolated testing with mock HTML
- API tests verify contracts and error handling
- E2E tests validate complete user workflows

**Test Coverage**:
- Parser unit tests: Mock HTML for each platform
- LLM tests: Mock API responses
- API integration tests: Test endpoints with real parsers
- E2E tests: Full workflow from URL to article display

---

## Resolved Clarifications

All technical decisions from user input have been incorporated:

✅ Frontend: Tailwind CSS + shadcn/ui  
✅ Parsing: Script-based HTML extraction  
✅ Output: Markdown format  
✅ LLM: Aliyun Dashscope with OpenAI SDK  
✅ Prompt: Detailed system prompt for WeChat expert persona  
✅ Architecture: Next.js API Routes + React components  

## Next Steps

Phase 1 will generate:
- `data-model.md`: Entity definitions and relationships
- `contracts/`: API endpoint contracts
- `quickstart.md`: Development setup guide
- Updated agent context for implementation
