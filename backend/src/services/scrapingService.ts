import axios from 'axios';
import * as cheerio from 'cheerio';

export class PTTScraper {
  async scrapeArticle(url: string): Promise<string> {
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      const mainContent = $('#main-content');
      if (!mainContent.length) {
        console.warn(`Could not find main-content div for URL: ${url}`);
        return '';
      }

      // Remove unwanted elements like metadata, push messages, and signature lines
      mainContent.find('.article-metaline').remove();
      mainContent.find('.article-metaline-right').remove();
      mainContent.find('.push').remove();
      // Remove signature lines often starting with '※'
      mainContent.contents().each((i, el) => {
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

      return cleanedText;
    } catch (error) {
      console.error(`Error scraping PTT URL ${url}:`, error);
      throw error;
    }
  }
}
