/**
 * Aliyun Dashscope LLM Client
 * Configured to use OpenAI SDK with Dashscope API
 */

import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
});

export const llmClient = client;

/**
 * Generate text using Dashscope LLM
 */
export async function generateText(
  systemPrompt: string,
  userPrompt: string,
  options?: {
    temperature?: number;
    maxTokens?: number;
    timeout?: number;
  }
): Promise<string> {
  const timeout = options?.timeout || 60000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await llmClient.chat.completions.create(
      {
        model: 'qwen-plus-2025-07-28',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2000,
      },
      { signal: controller.signal } as any
    );

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from LLM');
    }

    return content;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Stream text generation using Dashscope LLM
 */
export async function* streamGenerateText(
  systemPrompt: string,
  userPrompt: string,
  options?: {
    temperature?: number;
    maxTokens?: number;
    timeout?: number;
  }
): AsyncGenerator<string, void, unknown> {
  const timeout = options?.timeout || 60000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const stream = await llmClient.chat.completions.create(
      {
        model: 'qwen-plus-2025-07-28',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2000,
        stream: true,
      },
      { signal: controller.signal } as any
    );

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Check LLM service health
 */
export async function checkLLMHealth(): Promise<boolean> {
  try {
    const response = await generateText(
      'You are a helpful assistant.',
      'Say "ok" only.',
      { maxTokens: 10, timeout: 5000 }
    );
    return response.toLowerCase().includes('ok');
  } catch {
    return false;
  }
}
