import request from 'supertest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import apiRouter from '../../src/api'; // The main API router
import { PTTScraper } from '../../src/services/scrapingService';
import { AIService } from '../../src/services/aiService';

// Mock the services that the API depends on
vi.mock('../../src/services/scrapingService');
vi.mock('../../src/services/aiService');

// Create a basic Express app for testing
const app = express();
app.use(express.json());
app.use('/api', apiRouter); // Mount the API router at /api

describe('POST /api/proofread', () => {
  const mockPttUrl = 'https://www.ptt.cc/bbs/Gossiping/M.1633123456.A.123.html';
  const mockScrapedContent = 'This is the scraped PTT content.';
  const mockAnalysisResult = {
    originalContent: mockScrapedContent,
    translatedContent: '這是翻譯後的內容。',
    annotations: [
      {
        originalSnippet: 'scraped',
        translatedSnippet: '翻譯',
        issueType: 'Informal',
        explanation: '非正式用語',
      },
    ],
  };

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    vi.mocked(PTTScraper.prototype.scrapeArticle).mockResolvedValue(mockScrapedContent);
    vi.mocked(AIService.prototype.analyzePTTContent).mockResolvedValue(mockAnalysisResult);
  });

  it('should return 200 and analysis result for a valid PTT URL', async () => {
    const response = await request(app)
      .post('/api/proofread')
      .send({ url: mockPttUrl })
      .expect(200);

    expect(PTTScraper.prototype.scrapeArticle).toHaveBeenCalledWith(mockPttUrl);
    expect(AIService.prototype.analyzePTTContent).toHaveBeenCalledWith(mockScrapedContent);
    expect(response.body).toEqual(mockAnalysisResult);
  });

  it('should return 400 if URL is missing from request body', async () => {
    const response = await request(app)
      .post('/api/proofread')
      .send({})
      .expect(400);

    expect(response.body.message).toBe('URL is required.');
    expect(PTTScraper.prototype.scrapeArticle).not.toHaveBeenCalled();
    expect(AIService.prototype.analyzePTTContent).not.toHaveBeenCalled();
  });

  it('should return 500 if PTT scraping fails', async () => {
    vi.mocked(PTTScraper.prototype.scrapeArticle).mockRejectedValue(new Error('Scraping failed'));

    const response = await request(app)
      .post('/api/proofread')
      .send({ url: mockPttUrl })
      .expect(500);

    expect(response.body.message).toBe('Failed to process PTT post: Scraping failed');
    expect(PTTScraper.prototype.scrapeArticle).toHaveBeenCalledWith(mockPttUrl);
    expect(AIService.prototype.analyzePTTContent).not.toHaveBeenCalled();
  });

  it('should return 500 if AI analysis fails', async () => {
    vi.mocked(AIService.prototype.analyzePTTContent).mockRejectedValue(new Error('AI analysis failed'));

    const response = await request(app)
      .post('/api/proofread')
      .send({ url: mockPttUrl })
      .expect(500);

    expect(response.body.message).toBe('Failed to process PTT post: AI analysis failed');
    expect(PTTScraper.prototype.scrapeArticle).toHaveBeenCalledWith(mockPttUrl);
    expect(AIService.prototype.analyzePTTContent).toHaveBeenCalledWith(mockScrapedContent);
  });
});
