/**
 * Generic News Website Parser
 * Fallback parser for common news sites
 */

import { load } from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import { ParsedArticle } from '../types/news';
import { BaseParser, ParserResult } from './index';

export class NewsParser implements BaseParser {
  canParse(url: string): boolean {
    return true; // Fallback parser accepts any URL
  }

  async parse(url: string, html: string): Promise<ParserResult> {
    const $ = load(html);

    // Extract title
    const title =
      $('h1').first().text().trim() ||
      $('meta[property="og:title"]').attr('content') ||
      $('title').text().trim() ||
      'Untitled';

    if (!title || title === 'Untitled') {
      throw new Error('Could not extract article title');
    }

    // Extract author
    const author =
      $('[rel="author"]').text().trim() ||
      $('[class*="author"]').first().text().trim() ||
      $('meta[name="author"]').attr('content');

    // Extract publish date
    const publishedAtText =
      $('time').attr('datetime') ||
      $('[class*="publish"]').first().text().trim() ||
      $('meta[property="article:published_time"]').attr('content');
    const publishedAt = publishedAtText
      ? new Date(publishedAtText).toISOString()
      : new Date().toISOString();

    // Extract body content
    let body = '';
    const contentSelectors = [
      'article',
      '[role="main"]',
      '.article-content',
      '.post-content',
      '.entry-content',
      '.content',
      'main',
    ];

    for (const selector of contentSelectors) {
      const content = $(selector).first();
      if (content.length > 0) {
        // Remove script, style, and navigation elements
        content.find('script, style, nav, .nav, .navigation').remove();

        // Extract text from paragraphs
        const paragraphs: string[] = [];
        content.find('p').each((_, elem) => {
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

    // Fallback: extract from body if no content found
    if (!body || body.length < 50) {
      const bodyContent = $('body').clone();
      bodyContent.find('script, style, nav, header, footer').remove();
      const paragraphs: string[] = [];
      bodyContent.find('p').each((_, elem) => {
        const text = $(elem).text().trim();
        if (text && text.length > 20) {
          paragraphs.push(text);
        }
      });
      body = paragraphs.slice(0, 20).join('\n\n');
    }

    if (!body || body.length < 50) {
      throw new Error('Could not extract sufficient article content');
    }

    const article: ParsedArticle = {
      id: uuidv4(),
      sourceUrl: url,
      platform: 'news',
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
