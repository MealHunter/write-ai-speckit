// lib/utils.ts

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    EMPTY_INPUT: '请输入至少一个字符',
    INPUT_TOO_LONG: '输入内容不能超过500字符',
    API_TIMEOUT: '生成超时，请稍后重试',
    API_ERROR: '服务暂时不可用，请稍后重试',
    INVALID_RESPONSE: '未能生成内容，请尝试其他关键词',
  };
  return messages[code] || '发生错误，请稍后重试';
}

export function countWords(text: string): number {
  return text.split(/\s+/).filter((word) => word.length > 0).length;
}
