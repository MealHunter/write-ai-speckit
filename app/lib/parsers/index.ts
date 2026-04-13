/**
 * Parser Factory and Base Parser Interface
 * Handles platform detection and parser selection
 */

import { ParsedArticle, Image } from '../types/news';

export interface ParserResult {
  article: ParsedArticle;
  images: Image[];
}

export interface BaseParser {
  canParse(url: string): boolean;
  parse(url: string, html: string): Promise<ParserResult>;
}

/**
 * Detect platform from URL
 */
export function detectPlatform(
  url: string
): 'wechat' | 'zhihu' | 'news' | 'unknown' {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    if (hostname.includes('mp.weixin.qq.com')) {
      return 'wechat';
    }
    if (hostname.includes('zhihu.com')) {
      return 'zhihu';
    }
    if (
      hostname.includes('news') ||
      hostname.includes('cnn.com') ||
      hostname.includes('bbc.com') ||
      hostname.includes('reuters.com') ||
      hostname.includes('sina.com') ||
      hostname.includes('qq.com') ||
      hostname.includes('163.com')
    ) {
      return 'news';
    }
    return 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get parser for platform
 */
export async function getParser(
  platform: 'wechat' | 'zhihu' | 'news' | 'unknown'
): Promise<BaseParser> {
  switch (platform) {
    case 'wechat':
      const { WechatParser } = await import('./wechat');
      return new WechatParser();
    case 'zhihu':
      const { ZhihuParser } = await import('./zhihu');
      return new ZhihuParser();
    case 'news':
    case 'unknown':
      const { NewsParser } = await import('./news');
      return new NewsParser();
    default:
      const { NewsParser: DefaultParser } = await import('./news');
      return new DefaultParser();
  }
}

/**
 * Parse URL with automatic platform detection
 */
export async function parseUrl(
  url: string,
  html: string
): Promise<ParserResult> {
  const platform = detectPlatform(url);
  const parser = await getParser(platform);

  try {
    const result = await parser.parse(url, html);
    return result;
  } catch (error) {
    // Fallback to generic news parser if platform-specific parser fails
    if (platform !== 'news' && platform !== 'unknown') {
      const { NewsParser } = await import('./news');
      const fallbackParser = new NewsParser();
      return fallbackParser.parse(url, html);
    }
    throw error;
  }
}
