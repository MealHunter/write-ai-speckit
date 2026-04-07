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
6. **Anti-AI Patterns**: Avoid repetitive phrases, perfect grammar, overly structured content

**System Prompt (Optimized for Natural Output)**:
```
你是一位富有感情和思想深度的日记作者。你的任务是根据用户提供的关键词或主题，
创作一篇真实、自然的日记内容。这篇日记应该像一个真实的人在记录自己的日常思考和感受。

核心要求：
1. 以第一人称写作，表达个人的真实思想和感受
2. 内容必须包含用户提供的关键词或主题，自然融入叙述中
3. 避免AI生成的痕迹：
   - 不要使用过度完美的语法结构
   - 不要重复相同的短语或表达方式
   - 不要使用生硬的转折词（"总之"、"综上所述"等）
   - 允许一些不完美的表达，这样更像真实日记
4. 使用Markdown格式：
   - 标题：# YYYY年M月D日 星期X
   - 段落之间有空行
   - 用**文字**表示强调，但不要过度使用
   - 允许使用> 引用、- 列表等自然元素
5. 长度：200-500字
6. 语言特点：
   - 自然流畅的中文，像真实的人在写日记
   - 可以有一些口语化的表达
   - 包含具体的细节、感受、观察
   - 避免过于正式或学术的语言

写作风格指导：
- 像在和朋友倾诉，而不是在写文章
- 包含个人的情感波动和真实反应
- 可以有一些思考的过程，不一定要有完美的结论
- 使用具体的例子和细节，而不是抽象的概念

用户提供的主题或关键词：{user_input}

请创作一篇日记。记住，这应该读起来像一个真实的人在记录他们的想法，而不是AI生成的内容。
```

**Example Output Format**:
```markdown
# 2026年4月7日 星期一

今天在想起**清明节**的时候，心里涌起了一种复杂的情感。

这个传统的节日，承载着对过去的缅怀和对生命的思考。我想起了小时候和家人一起去扫墓的场景，那时候天气总是有点阴沉，空气里弥漫着青草的味道。

现在长大了，对清明节的理解也变得不同。它不仅仅是一个节日，更像是一个提醒——提醒我们去珍惜身边的人，去思考生命的意义。

[Natural diary content with varied sentence structure and authentic voice]
```

**Anti-AI Techniques**:
- Use varied sentence lengths (short and long mixed)
- Include rhetorical questions
- Use incomplete thoughts or trailing off
- Include specific sensory details
- Show emotional progression, not just conclusions
- Use contractions and casual language
- Avoid parallel structures that feel too perfect

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
  try {
    const { input } = await request.json();
    
    // Validate input
    if (!input || input.trim().length === 0) {
      return Response.json(
        {
          success: false,
          error: {
            code: "EMPTY_INPUT",
            message: "请输入至少一个字符",
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 }
      );
    }

    if (input.length > 500) {
      return Response.json(
        {
          success: false,
          error: {
            code: "INPUT_TOO_LONG",
            message: "输入内容不能超过500字符",
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 }
      );
    }

    const client = createLLMClient();
    
    const completion = await client.chat.completions.create({
      model: "qwen-plus-2025-07-28",
      messages: [
        {
          role: "system",
          content: `你是一位富有感情和思想深度的日记作者。你的任务是根据用户提供的关键词或主题，
创作一篇真实、自然的日记内容。这篇日记应该像一个真实的人在记录自己的日常思考和感受。

核心要求：
1. 以第一人称写作，表达个人的真实思想和感受
2. 内容必须包含用户提供的关键词或主题，自然融入叙述中
3. 避免AI生成的痕迹：
   - 不要使用过度完美的语法结构
   - 不要重复相同的短语或表达方式
   - 不要使用生硬的转折词
   - 允许一些不完美的表达，这样更像真实日记
4. 使用Markdown格式：
   - 标题：# YYYY年M月D日 星期X
   - 段落之间有空行
   - 用**文字**表示强调
5. 长度：200-500字
6. 语言特点：自然流畅的中文，像真实的人在写日记`,
        },
        {
          role: "user",
          content: `请根据以下关键词或主题创作一篇日记：\n\n${input}`,
        },
      ],
      temperature: 0.7, // Balanced creativity and consistency
      max_tokens: 1000,
      top_p: 0.9,
    });

    const content = completion.choices[0].message.content;
    
    if (!content || content.trim().length === 0) {
      return Response.json(
        {
          success: false,
          error: {
            code: "INVALID_RESPONSE",
            message: "未能生成内容，请尝试其他关键词",
            timestamp: new Date().toISOString(),
          },
        },
        { status: 500 }
      );
    }

    // Count words (approximate)
    const wordCount = content.split(/\s+/).length;

    return Response.json({
      success: true,
      data: {
        content,
        generatedAt: new Date().toISOString(),
        inputKeyword: input,
        wordCount,
      },
    });
  } catch (error) {
    console.error("Diary generation error:", error);
    
    const isTimeout = error instanceof Error && error.message.includes("timeout");
    
    return Response.json(
      {
        success: false,
        error: {
          code: isTimeout ? "API_TIMEOUT" : "API_ERROR",
          message: isTimeout 
            ? "生成超时，请稍后重试" 
            : "服务暂时不可用，请稍后重试",
          timestamp: new Date().toISOString(),
          details: process.env.NODE_ENV === "development" ? error instanceof Error ? error.message : String(error) : undefined,
        },
      },
      { status: 500 }
    );
  }
}
```

**Key Features**:
- Validates input on both frontend and backend
- Uses system prompt to guide natural output
- Handles all error cases with user-friendly messages
- Returns Markdown-formatted content
- Includes word count for analytics
- Proper error logging for debugging

## Markdown Rendering

### Decision: Use React Markdown Library with Tailwind Prose

**Chosen**: `react-markdown` with `remark-gfm` for GitHub Flavored Markdown + Tailwind CSS prose styling

**Rationale**:
- Lightweight, well-maintained library
- Supports full Markdown syntax
- Easy integration with React components
- Safe HTML rendering (prevents XSS)
- Tailwind prose provides beautiful default styling
- Aligns with project's Tailwind CSS + shadcn/ui architecture

**Implementation**:

```typescript
// components/DiaryDisplay.tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface DiaryDisplayProps {
  content: string;
  className?: string;
}

export function DiaryDisplay({ content, className }: DiaryDisplayProps) {
  return (
    <div className={cn(
      "prose prose-sm dark:prose-invert max-w-2xl mx-auto",
      "prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white",
      "prose-p:text-gray-700 dark:prose-p:text-gray-300",
      "prose-strong:font-semibold prose-strong:text-gray-900 dark:prose-strong:text-white",
      "prose-em:italic prose-em:text-gray-700 dark:prose-em:text-gray-300",
      "prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded",
      "prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:text-gray-100",
      "prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600",
      "prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400",
      "prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6",
      "prose-li:text-gray-700 dark:prose-li:text-gray-300",
      "prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:underline",
      "prose-hr:border-gray-300 dark:prose-hr:border-gray-600",
      className
    )}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom component rendering if needed
          h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-5 mb-3" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
          p: ({node, ...props}) => <p className="my-4 leading-relaxed" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
```

**Installation**:
```bash
npm install react-markdown remark-gfm
```

**Usage in Page**:
```typescript
// app/page.tsx
import { DiaryDisplay } from '@/components/DiaryDisplay';

export default function Home() {
  const [diaryContent, setDiaryContent] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Form section */}
      <DiaryForm onSuccess={(content) => setDiaryContent(content)} />
      
      {/* Display section */}
      {diaryContent && (
        <div className="mt-8 py-8 border-t border-gray-200 dark:border-gray-800">
          <DiaryDisplay content={diaryContent} />
        </div>
      )}
    </div>
  );
}
```

**Markdown Features Supported**:
- Headers: `# H1`, `## H2`, `### H3`
- Emphasis: `**bold**`, `*italic*`, `***bold italic***`
- Lists: `- item`, `1. numbered`
- Blockquotes: `> quote`
- Code: `` `inline` ``, ` ```code block``` `
- Links: `[text](url)`
- Horizontal rules: `---`
- Tables: GitHub Flavored Markdown tables
- Strikethrough: `~~text~~`

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
