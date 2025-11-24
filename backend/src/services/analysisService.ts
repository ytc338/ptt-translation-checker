import { PTTScraper } from './scrapingService';
import { AIService } from './aiService';
import { AnalysisResult } from '../models';

export class AnalysisService {
  private pttScraper: PTTScraper;
  private aiService: AIService;

  constructor() {
    this.pttScraper = new PTTScraper();
    this.aiService = new AIService();
  }

  async translatePttPost(url: string): Promise<AnalysisResult> {
    try {
      const pttContent = await this.pttScraper.scrapeArticle(url);

      if (!pttContent) {
        throw new Error('No content scraped from the provided PTT URL.');
      }

      const analysisResult = await this.aiService.translateContent(pttContent);
      // Ensure originalContent matches what was scraped (though aiService now handles extraction)
      // We'll trust aiService's extraction for the result structure
      return analysisResult;
    } catch (error) {
      console.error(`Error translating PTT post from URL ${url}:`, error);
      throw error;
    }
  }

  async analyzeTranslations(englishSource: string, googleTranslation: string, opTranslation: string): Promise<any[]> {
    try {
      return await this.aiService.proofreadContent(englishSource, googleTranslation, opTranslation);
    } catch (error) {
      console.error('Error analyzing translations:', error);
      throw error;
    }
  }
}
