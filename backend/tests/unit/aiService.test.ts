import { describe, it, expect, vi } from 'vitest';
import { AIService } from '../../src/services/aiService';
import { GeminiClient } from '../../src/services/geminiClient'; // Assuming this exists

vi.mock('../../src/services/geminiClient'); // Mock the GeminiClient

describe('AIService', () => {
  it('should call GeminiClient with correct prompt and return analysis', async () => {
    const mockGeminiResponse = {
      translatedContent: '正式台灣華語譯文',
      annotations: [
        {
          originalSnippet: '錢',
          translatedSnippet: '金錢',
          issueType: 'Slang',
          explanation: '「錢」在PTT上常作為「推」文的諧音梗，此處假設為網路用語，翻譯為「金錢」較為正式。',
        },
      ],
    };

    // Mock the generateContent method of GeminiClient
    vi.mocked(GeminiClient.prototype.generateContent).mockResolvedValue(mockGeminiResponse);

    const aiService = new AIService();
    const pttContent = '推 a: 錢\n→ b: 樓下支援\n--';
    const analysisResult = await aiService.analyzePTTContent(pttContent);

    expect(GeminiClient.prototype.generateContent).toHaveBeenCalledWith(expect.stringContaining(pttContent));
    expect(analysisResult).toEqual(mockGeminiResponse);
  });

  it('should throw an error if GeminiClient fails', async () => {
    vi.mocked(GeminiClient.prototype.generateContent).mockRejectedValue(new Error('Gemini API error'));

    const aiService = new AIService();
    const pttContent = 'some content';

    await expect(aiService.analyzePTTContent(pttContent)).rejects.toThrow('Gemini API error');
  });

  it('should handle empty content gracefully', async () => {
    const mockGeminiResponse = {
      translatedContent: '',
      annotations: [],
    };
    vi.mocked(GeminiClient.prototype.generateContent).mockResolvedValue(mockGeminiResponse);

    const aiService = new AIService();
    const pttContent = '';
    const analysisResult = await aiService.analyzePTTContent(pttContent);

    expect(GeminiClient.prototype.generateContent).toHaveBeenCalledWith(expect.stringContaining(pttContent));
    expect(analysisResult).toEqual(mockGeminiResponse);
  });
});
