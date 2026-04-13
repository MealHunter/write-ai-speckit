/**
 * WeChat Official Account Parser
 * Extracts article content and images from WeChat HTML
 */

import { load } from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import { ParsedArticle } from '../types/news';
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
      status: 'success',
    };

    return { article, images: [] };
  }
}
