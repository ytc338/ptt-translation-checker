import { GoogleTranslationClient } from './googleTranslationClient';
import { GeminiClient } from './geminiClient';
import { AnalysisResult } from '../models';

export class AIService {
  private translationClient: GoogleTranslationClient;
  private geminiClient: GeminiClient;

  constructor() {
    this.translationClient = new GoogleTranslationClient();
    this.geminiClient = new GeminiClient();
  }

  async translateContent(pttContent: string): Promise<AnalysisResult> {
    try {
      // 1. Extract English Source and OP's Translation
      const { englishSource, opTranslation } = await this.geminiClient.extractContent(pttContent);

      const sourceText = englishSource || pttContent;

      // 2. Translate English Source using Google Cloud
      const googleResult = await this.translationClient.translateText(sourceText);
      const googleTranslation = googleResult.translatedContent;

      return {
        originalContent: sourceText,
        translatedContent: googleTranslation,
        opTranslation: opTranslation,
        annotations: [], // Annotations will be fetched separately
      };
    } catch (error) {
      console.error('Error in AIService translating content:', error);
      throw error;
    }
  }

  async proofreadContent(englishSource: string, googleTranslation: string, opTranslation: string): Promise<any[]> {
    try {
      if (!opTranslation) {
        return [];
      }
      return await this.geminiClient.compareTranslations(englishSource, googleTranslation, opTranslation);
    } catch (error) {
      console.error('Error in AIService proofreading content:', error);
      throw error;
    }
  }
}
