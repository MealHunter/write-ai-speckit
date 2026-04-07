# Research: AI Diary Generator

**Phase**: 0 - Research & Clarification  
**Date**: 2026-04-07  
**Status**: Complete

## LLM Prompt Engineering

### Decision: Qwen Model via Aliyun DashScope

**Chosen**: Qwen Plus 2025-07-28 via OpenAI SDK compatible mode (Aliyun DashScope)

**Rationale**: 
- User specified OpenAI SDK with Aliyun DashScope endpoint
- Qwen model optimized for Chinese language content (diary generation in Chinese context)
- Compatible with OpenAI SDK reduces integration complexity
- Cost-effective for MVP

**Alternatives Considered**:
- Claude API: More capable but requires separate SDK, higher cost
- GPT-4: Overkill for diary generation, higher latency
- Local LLM: Adds infrastructure complexity, not suitable for MVP

### Prompt Engineering Strategy

**Goal**: Generate natural, human-like diary entries that don't feel AI-generated

**Key Principles**:
1. **Persona**: Write as a reflective individual journaling personal thoughts
2. **Tone**: Conversational, intimate, first-person perspective
3. **Structure**: Natural paragraph breaks, varied sentence length
4. **Authenticity**: Include sensory details, emotions, personal observations
5. **Markdown Format**: Use markdown for formatting (bold for emphasis, line breaks for structure)

**System Prompt Template**:
```
你是一位富有感情和思想深度的日记作者。你的任务是根据用户提供的关键词或主题，
创作一篇真实、自然的日记内容。

要求：
1. 以第一人称写作，表达个人的思想和感受
2. 内容应该像真实的日记，包含个人观察、情感和反思
3. 避免AI生成的痕迹（如过度的完美、重复的短语、不自然的转折）
4. 使用Markdown格式，包括适当的段落分隔和强调
5. 长度：200-500字
6. 语言：自然流畅的中文，避免生硬的表达

用户提供的主题或关键词：{user_input}

请创作一篇日记。
```

**Example Output Format**:
```markdown
# 2026年4月7日 星期一

今天在想起**清明节**的时候，心里涌起了一种复杂的情感。

这个传统的节日，承载着对过去的缅怀和对生命的思考。我想起了...

[Natural diary content with markdown formatting]
```

## OpenAI SDK Integration Pattern

### Decision: Use OpenAI SDK in Compatible Mode

**Chosen**: OpenAI SDK with Aliyun DashScope baseURL

**Rationale**:
- User provided working example code
- Minimal setup required (just API key + baseURL)
- Familiar API surface for developers
- No additional dependencies needed

**Implementation Pattern**:

```typescript
// lib/llm/client.ts
import OpenAI from "openai";

export const createLLMClient = () => {
  return new OpenAI({
    apiKey: process.env.DASHSCOPE_API_KEY,
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  });
};

// app/api/generate-diary/route.ts
import { createLLMClient } from "@/lib/llm/client";
import { generateDiaryPrompt } from "@/lib/llm/diaryPrompt";

export async function POST(request: Request) {
  const { input } = await request.json();
  
  const client = createLLMClient();
  const completion = await client.chat.completions.create({
    model: "qwen-plus-2025-07-28",
    messages: [
      {
        role: "system",
        content: "你是一位富有感情和思想深度的日记作者..."
      },
      {
        role: "user",
        content: generateDiaryPrompt(input)
      }
    ],
    temperature: 0.7, // Balanced creativity and consistency
    max_tokens: 1000,
  });

  return Response.json({
    success: true,
    content: completion.choices[0].message.content
  });
}
```

## Markdown Rendering

### Decision: Use React Markdown Library

**Chosen**: `react-markdown` with `remark-gfm` for GitHub Flavored Markdown

**Rationale**:
- Lightweight, well-maintained library
- Supports full Markdown syntax
- Easy integration with React components
- Safe HTML rendering (prevents XSS)

**Implementation**:

```typescript
// components/DiaryDisplay.tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function DiaryDisplay({ content }: { content: string }) {
  return (
    <div className="prose prose-sm max-w-2xl mx-auto">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
```

## Error Handling Strategy

### Decision: Graceful Degradation with User-Friendly Messages

**Rationale**:
- LLM calls can fail (timeout, rate limit, API error)
- Users should understand what went wrong
- Provide actionable next steps

**Error Types**:
1. **Empty Input**: "请输入至少一个字符" (Please enter at least one character)
2. **Input Too Long**: "输入内容不能超过500字符" (Input cannot exceed 500 characters)
3. **API Timeout**: "生成超时，请稍后重试" (Generation timed out, please try again)
4. **API Error**: "服务暂时不可用，请稍后重试" (Service temporarily unavailable)
5. **Empty Response**: "未能生成内容，请尝试其他关键词" (Could not generate content, try different keywords)

## Performance Considerations

### Decision: Client-Side Loading State + Server-Side Timeout

**Rationale**:
- LLM latency can be 5-30 seconds
- Users need visual feedback
- Prevent hanging requests

**Implementation**:
- Frontend: Show loading spinner immediately on submit
- Backend: Set 30-second timeout on LLM call
- Frontend: Display error if no response after 35 seconds

## Testing Strategy

### Unit Tests
- Prompt generation logic (ensure correct formatting)
- Error handling (validate error messages)
- Input validation (empty, too long, valid)

### Integration Tests
- Full diary generation flow (input → API → display)
- Error scenarios (API failure, timeout)
- Markdown rendering (verify output format)

### E2E Tests (Playwright)
- User submits keyword → receives diary
- User submits description → receives diary
- Loading state displays during processing
- Error message displays on failure
