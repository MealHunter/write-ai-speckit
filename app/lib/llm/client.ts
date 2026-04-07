// lib/llm/client.ts

import OpenAI from 'openai';

export const createLLMClient = () => {
  return new OpenAI({
    apiKey: process.env.DASHSCOPE_API_KEY,
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  });
};
