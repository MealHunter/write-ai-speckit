/**
 * Zhihu Answer Parser
 * Extracts answer content and images from Zhihu HTML
 */

import { load } from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import { ParsedArticle, Image } from '../types/news';
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

    // Extract images
    const images = this.extractImages($, url);

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
      status: images.length === 0 ? 'partial' : 'success',
    };

    return { article, images };
  }

  private extractImages($: any, baseUrl: string): Image[] {
    const images: Image[] = [];
    const seenUrls = new Set<string>();
    let position = 0;

    // Extract from img tags
    $('img').each((_: number, elem: any) => {
      const src =
        $(elem).attr('src') ||
        $(elem).attr('data-src') ||
        $(elem).attr('data-original');

      if (src && !seenUrls.has(src)) {
        seenUrls.add(src);
        const imageUrl = this.normalizeImageUrl(src, baseUrl);

        if (imageUrl) {
          images.push({
            id: uuidv4(),
            articleId: '', // Will be set by caller
            url: imageUrl,
            title: $(elem).attr('alt') || undefined,
            position,
            extractedAt: new Date().toISOString(),
            status: 'valid',
          });
          position++;
        }
      }
    });

    return images;
  }

  private normalizeImageUrl(url: string, baseUrl: string): string | null {
    try {
      // Skip data URLs and very small images
      if (url.startsWith('data:') || url.length < 10) {
        return null;
      }

      // Handle relative URLs
      if (!url.startsWith('http')) {
        try {
          const base = new URL(baseUrl);
          url = new URL(url, base).href;
        } catch {
          return null;
        }
      }

      return url;
    } catch {
      return null;
    }
  }
}
