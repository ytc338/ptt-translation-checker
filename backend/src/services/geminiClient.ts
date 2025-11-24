import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalysisResult, Annotation } from '../models';

export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private model: ReturnType<GoogleGenerativeAI['getGenerativeModel']>;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
  }

  async extractContent(pttContent: string): Promise<{ englishSource: string; opTranslation: string }> {
    const prompt = `
      You are an expert content analyzer. Your task is to separate the original English source text from the OP's Mandarin Chinese translation in a PTT forum post.

      Input Text:
      ${pttContent}

      Your response MUST be in JSON format with two keys:
      - "englishSource": The original English text found in the post.
      - "opTranslation": The Mandarin Chinese translation provided by the OP.

      If there is no clear English source or OP translation, return empty strings for those fields.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      return this.parseJson(text);
    } catch (error) {
      console.error('Error extracting content with Gemini:', error);
      throw new Error('Failed to extract content from PTT post.');
    }
  }

  async compareTranslations(englishSource: string, googleTranslation: string, opTranslation: string): Promise<Annotation[]> {
    const prompt = `
      You are an expert proofreader and translation critic.
      Your task is to compare the OP's Mandarin translation against the original English source and a reference Google translation.
      Identify errors, mistranslations, or significant deviations in the OP's translation.

      Original English Source:
      ${englishSource}

      Google Translation (Reference):
      ${googleTranslation}

      OP's Translation (Target for Proofreading):
      ${opTranslation}

      Focus on:
      1. **Mistranslations**: Where the OP got the meaning wrong compared to the English source.
      2. **Omissions**: Important details left out by the OP.
      3. **Inaccuracies**: Where the OP's specific word choice is factually incorrect or misleading.

      Your response MUST be in JSON format with a single key "annotations", which is an array of objects.
      Each object should have:
      - "originalSnippet": The specific segment of the OP's translation that has the error.
      - "translatedSnippet": The correct translation (from Google or your own correction).
      - "issueType": One of "MISTRANSLATION", "OMISSION", "INACCURACY".
      - "explanation": A brief explanation of why the OP's translation is wrong, referencing the English source.
      - "suggestion": A better translation for that segment.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      const parsed = this.parseJson(text);
      return parsed.annotations || [];
    } catch (error) {
      console.error('Error comparing translations with Gemini:', error);
      return []; // Return empty annotations on failure to allow the process to continue
    }
  }

  private parseJson(text: string): any {
    try {
      let jsonString = text.trim();
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.substring(7, jsonString.lastIndexOf('```')).trim();
      }
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing JSON from Gemini:', error);
      throw new Error('Invalid JSON response from Gemini.');
    }
  }
}
