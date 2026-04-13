/**
 * LLM Prompt Templates for News Rewrite Tool
 * Crafted for WeChat Official Account publication
 */

export const SYSTEM_PROMPT = `你是一位资深的微信公众号内容编辑和新闻记者。你的任务是将原始新闻文章改写成适合微信公众号发布的高质量文章。

你的改写应该遵循以下原则：
1. 保留原文的核心信息和观点
2. 提升文章的可读性和吸引力
3. 使用清晰的结构（引言、分析、总结）
4. 添加适当的小标题和段落分隔
5. 使用自然、流畅的中文表达
6. 适当添加行业洞察和背景信息
7. 确保内容符合微信公众号的发布标准
8. 生成的文章应该约1000字左右

输出格式要求：
- 使用Markdown格式
- 包含清晰的标题和小标题
- 段落之间有适当的空行
- 重点内容可以使用**加粗**强调`;

export function createParsePrompt(
  title: string,
  body: string,
  platform: string
): string {
  return `请基于以下原始文章内容，生成一篇适合微信公众号发布的改写文章。

原始文章来源：${platform}
原始标题：${title}

原始内容：
${body}

请生成：
1. 三个不同角度的标题建议（每个标题50-200字）
2. 一篇约1000字的改写文章（Markdown格式）

输出格式（严格按照以下格式）：
---TITLES---
标题1
---
标题2
---
标题3
---CONTENT---
改写后的文章内容（Markdown格式）`;
}

export function createFallbackPrompt(userText: string): string {
  return `用户提供了以下文本内容，请基于此生成一篇适合微信公众号发布的文章。

用户提供的内容：
${userText}

请生成：
1. 三个不同角度的标题建议（每个标题50-200字）
2. 一篇约1000字的文章（Markdown格式）

输出格式（严格按照以下格式）：
---TITLES---
标题1
---
标题2
---
标题3
---CONTENT---
文章内容（Markdown格式）`;
}

/**
 * Parse LLM response to extract titles and content
 */
export function parseGenerationResponse(response: string): {
  titles: string[];
  content: string;
} {
  const titlesMatch = response.match(/---TITLES---([\s\S]*?)---CONTENT---/);
  const contentMatch = response.match(/---CONTENT---([\s\S]*?)$/);

  if (!titlesMatch || !contentMatch) {
    throw new Error('Invalid response format from LLM');
  }

  const titlesText = titlesMatch[1].trim();
  const titles = titlesText
    .split('---')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  const content = contentMatch[1].trim();

  if (titles.length !== 3) {
    throw new Error(`Expected 3 titles, got ${titles.length}`);
  }

  return { titles, content };
}

/**
 * Calculate word count (approximate for Chinese text)
 */
export function calculateWordCount(text: string): number {
  // For Chinese text, count characters as words
  // For English, count space-separated words
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const englishWords = (text.match(/\b[a-zA-Z]+\b/g) || []).length;
  return chineseChars + Math.ceil(englishWords / 1.5);
}
