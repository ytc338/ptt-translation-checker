import axios from 'axios';
import { load } from 'cheerio';

export class PTTScraper {
  async scrapeArticle(url: string): Promise<{ title: string; content: string } | null> {
    try {
      const { data } = await axios.get(url);
      const $ = load(data);

      const mainContent = $('#main-content');
      if (!mainContent.length) {
        console.warn(`Could not find main-content div for URL: ${url}`);
        return null;
      }

      // Extract title from article-metaline
      let title = '';
      const metalines = mainContent.find('.article-metaline');
      metalines.each((i: number, el: any) => {
        const tag = $(el).find('.article-meta-tag').text().trim();
        const value = $(el).find('.article-meta-value').text().trim();
        if (tag === '標題') {
          title = value;
        }
      });

      // Remove unwanted elements like metadata, push messages, and signature lines
      mainContent.find('.article-metaline').remove();
      mainContent.find('.article-metaline-right').remove();
      mainContent.find('.push').remove();
      // Remove signature lines often starting with '※'
      mainContent.contents().each((i: number, el: any) => {
        if (el.type === 'text' && $(el).text().trim().startsWith('※')) {
          $(el).remove();
        }
      });
      // Remove the initial PTT footer that often contains links/info
      mainContent.find('span.f2').remove();
      mainContent.find('.f2').remove(); // Catch any remaining f2 divs which often contain links/metadata

      // Get the cleaned text content
      let cleanedText = mainContent.text().trim();

      // Basic cleanup to remove excessive newlines and spaces
      cleanedText = cleanedText.replace(/\n\s*\n/g, '\n').replace(/ +/g, ' ');

      return { title, content: cleanedText };
    } catch (error) {
      console.error(`Error scraping PTT URL ${url}:`, error);
      throw error;
    }
  }
}
