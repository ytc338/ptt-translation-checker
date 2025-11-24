import axios from 'axios';
import { AnalysisResult } from '../models';

export class GoogleTranslationClient {
  private apiKey: string;
  private apiUrl = 'https://translation.googleapis.com/language/translate/v2';

  constructor() {
    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    if (!apiKey) {
      console.warn('GOOGLE_CLOUD_API_KEY is not set in environment variables. Translation will fail.');
    }
    this.apiKey = apiKey || '';
  }

  async translateText(text: string): Promise<AnalysisResult> {
    if (!this.apiKey) {
      throw new Error('GOOGLE_CLOUD_API_KEY is missing.');
    }

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          q: text,
          target: 'zh-TW',
          format: 'text',
        },
        {
          params: {
            key: this.apiKey,
          },
        }
      );

      const translations = response.data.data.translations;
      if (!translations || translations.length === 0) {
        throw new Error('No translation returned from Google Cloud API.');
      }

      const translatedText = translations[0].translatedText;

      // Return result with empty annotations as requested
      return {
        originalContent: text, // This will be overwritten/verified by AnalysisService
        translatedContent: translatedText,
        annotations: [], // Proofreading disabled
      };
    } catch (error: any) {
      if (error.response) {
        console.error('Google Cloud API Error Details:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.error('Error calling Google Cloud Translation API:', error.message);
      }
      throw error;
    }
  }
}
