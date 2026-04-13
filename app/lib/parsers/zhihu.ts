/**
 * Zhihu Answer Parser
 * Extracts answer content and images from Zhihu HTML
 */

import { load } from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import { ParsedArticle } from '../types/news';
import { BaseParser, ParserResult } from './index';

export class ZhihuParser implements BaseParser {
  canParse(url: string): boolean {
    return url.includes('zhihu.com');
  }

  async parse(url: string, html: string): Promise<ParserResult> {
    const $ = load(html);

    // Extract title (question)
    const title =
      $('h1').first().text().trim() ||
      $('meta[property="og:title"]').attr('content') ||
      'Untitled';

    if (!title || title === 'Untitled') {
      throw new Error('Could not extract question title');
    }

    // Extract author
    const author =
      $('[data-testid="authorName"]').text().trim() ||
      $('a.UserLink-link').first().text().trim() ||
      undefined;

    // Extract publish date
    const publishedAtText =
      $('[data-testid="ContentItem-time"]').attr('title') ||
      $('time').attr('datetime');
    const publishedAt = publishedAtText
      ? new Date(publishedAtText).toISOString()
      : new Date().toISOString();

    // Extract answer content
    let body = '';
    const contentSelectors = [
      '[data-testid="Answer-content"]',
      '.RichContent-inner',
      '.RichText',
      '[class*="content"]',
    ];

    for (const selector of contentSelectors) {
      const content = $(selector).first();
      if (content.length > 0) {
        // Remove script and style tags
        content.find('script, style').remove();

        // Extract text from paragraphs and divs
        const paragraphs: string[] = [];
        content.find('p, div[class*="paragraph"]').each((_, elem) => {
          const text = $(elem).text().trim();
          if (text && text.length > 0) {
            paragraphs.push(text);
          }
        });

        body = paragraphs.join('\n\n');
        if (body.length > 50) {
          break;
        }
      }
    }

    if (!body || body.length < 50) {
      throw new Error('Could not extract sufficient answer content');
    }

    const article: ParsedArticle = {
      id: uuidv4(),
      sourceUrl: url,
      platform: 'zhihu',
      title,
      body,
      author,
      publishedAt,
      contentLength: body.length,
      extractedAt: new Date().toISOString(),
      language: 'zh',
      status: 'success',
    };

    return { article, images: [] };
  }
}
