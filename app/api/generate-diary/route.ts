// app/api/generate-diary/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createLLMClient } from '@/app/lib/llm/client';
import { SYSTEM_PROMPT, generateUserPrompt } from '@/app/lib/llm/diaryPrompt';
import { GenerateDiaryResponse, DiaryError } from '@/app/lib/types/diary';

export async function POST(request: NextRequest): Promise<NextResponse<GenerateDiaryResponse>> {
  try {
    const { input } = await request.json();

    // Validate input
    if (!input || input.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'EMPTY_INPUT',
            message: '请输入至少一个字符',
            timestamp: new Date(),
          },
        },
        { status: 400 }
      );
    }

    if (input.length > 500) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INPUT_TOO_LONG',
            message: '输入内容不能超过500字符',
            timestamp: new Date(),
          },
        },
        { status: 400 }
      );
    }

    const client = createLLMClient();

    const completion = await client.chat.completions.create({
      model: 'qwen-plus-2025-07-28',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: generateUserPrompt(input),
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 0.9,
    });

    const content = completion.choices[0].message.content;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_RESPONSE',
            message: '未能生成内容，请尝试其他关键词',
            timestamp: new Date(),
          },
        },
        { status: 500 }
      );
    }

    // Count words (approximate)
    const wordCount = content.split(/\s+/).length;

    return NextResponse.json({
      success: true,
      data: {
        content,
        generatedAt: new Date(),
        inputKeyword: input,
        wordCount,
      },
    });
  } catch (error) {
    console.error('Diary generation error:', error);

    const isTimeout = error instanceof Error && error.message.includes('timeout');

    const errorResponse: DiaryError = {
      code: isTimeout ? 'API_TIMEOUT' : 'API_ERROR',
      message: isTimeout ? '生成超时，请稍后重试' : '服务暂时不可用，请稍后重试',
      timestamp: new Date(),
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
    };

    return NextResponse.json(
      {
        success: false,
        error: errorResponse,
      },
      { status: 500 }
    );
  }
}
