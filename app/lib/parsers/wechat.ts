/**
 * WeChat Official Account Parser
 * Extracts article content and images from WeChat HTML
 */

import { load } from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import { ParsedArticle, Image } from '../types/news';
import { BaseParser, ParserResult } from './index';

export class WechatParser implements BaseParser {
  canParse(url: string): boolean {
    return url.includes('mp.weixin.qq.com');
  }

  async parse(url: string, html: string): Promise<ParserResult> {
    const $ = load(html);

    // Extract title
    const title =
      $('h1.rich_media_title').text().trim() ||
      $('meta[property="og:title"]').attr('content') ||
      'Untitled';

    if (!title || title === 'Untitled') {
      throw new Error('Could not extract article title');
    }

    // Extract author
    const author =
      $('.rich_media_meta_text').first().text().trim() ||
      $('meta[name="author"]').attr('content');

    // Extract publish date
    const publishedAtText = $('.rich_media_meta_text').eq(1).text().trim();
    const publishedAt = publishedAtText
      ? new Date(publishedAtText).toISOString()
      : new Date().toISOString();

    // Extract body content
    let body = '';
    const contentDiv = $('#js_content, .rich_media_content, .article-content');

    if (contentDiv.length > 0) {
      // Remove script and style tags
      contentDiv.find('script, style').remove();

      // Extract text from paragraphs
      const paragraphs: string[] = [];
      contentDiv.find('p').each((_, elem) => {
        const text = $(elem).text().trim();
        if (text) {
          paragraphs.push(text);
        }
      });

      body = paragraphs.join('\n\n');
    }

    if (!body || body.length < 50) {
      throw new Error('Could not extract sufficient article content');
    }

    // Extract images
    const images = this.extractImages($, url);

    const article: ParsedArticle = {
      id: uuidv4(),
      sourceUrl: url,
      platform: 'wechat',
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
