import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import cheerio from 'cheerio';
import { PTTScraper } from '../../src/services/scrapingService'; // Assuming the service will be here

vi.mock('axios');
vi.mock('cheerio'); // Mock cheerio for load method, but we'll manually load in the test

// Helper to manually mock cheerio.load
const mockCheerioLoad = (html: string) => {
  // @ts-ignore
  cheerio.load.mockImplementation(() => {
    // This is a simplified mock. In a real scenario, you'd likely want to return a functional cheerio object.
    // For this test, we are primarily testing the integration with cheerio.
    const actualCheerio = jest.requireActual('cheerio');
    return actualCheerio.load(html);
  });
};


describe('PTTScraper', () => {
  it('should extract article content correctly', async () => {
    const mockHtml = `
      <html>
        <body>
          <div id="main-content">
            <div class="article-metaline"><span class="article-meta-tag">作者</span><span class="article-meta-value">somebody (Someone)</span></div>
            <div class="article-metaline-right"><span class="article-meta-tag">看板</span><span class="article-meta-value">Gossiping</span></div>
            <div class="article-metaline"><span class="article-meta-tag">標題</span><span class="article-meta-value">[問卦] PTT發文會怎樣</span></div>
            <div class="article-metaline"><span class="article-meta-tag">時間</span><span class="article-meta-value">Mon Nov  1 00:00:00 2023</span></div>
            <div class="f2">※ 發信站: 批踢踢實業坊(ptt.cc), 來自: 1.2.3.4 (臺灣)</div>
            <div class="f2">※ 文章網址: <a href="https://www.ptt.cc/bbs/Gossiping/M.123456.A.789.html" target="_blank" rel="noreferrer noopener nofollow">https://www.ptt.cc/bbs/Gossiping/M.123456.A.789.html</a></div>
            <div class="f2">推 a: 錢</div>
            <div class="f2">→ b: 樓下支援</div>
            <span class="f2">※ 發信站: 批踢踢實業坊(ptt.cc)</span><br>
            <span class="f2">※ 文章網址: <a href="https://www.ptt.cc/bbs/Gossiping/M.123456.A.789.html">https://www.ptt.cc/bbs/Gossiping/M.123456.A.789.html</a></span><br>
            <div class="f2">推 c: 哈哈哈</div>
            <div class="push"><span class="f1 hl push-tag">噓 </span><span class="f3 hl push-userid">d</span><span class="f3 push-content">: 滾</span><span class="push-ipdatetime"> 11/01 00:01</span></div>
            <div class="push"><span class="hl push-tag">推 </span><span class="f3 hl push-userid">e</span><span class="f3 push-content">: 讚</span><span class="push-ipdatetime"> 11/01 00:02</span></div>
            <div class="push"><span class="f1 hl push-tag">→ </span><span class="f3 hl push-userid">f</span><span class="f3 push-content">: 不錯喔</span><span class="push-ipdatetime"> 11/01 00:03</span></div>
            <div class="f2">--</div>
            <div class="f2">※ 發信站: 批踢踢實業坊(ptt.cc)</div>
            <div class="f2">※ 文章網址: https://www.ptt.cc/bbs/Gossiping/M.1633123456.A.123.html</div>
            <div class="f2">推 gg: good</div>
          </div>
        </body>
      </html>
    `;

    // Mock axios to return the mock HTML
    vi.mocked(axios.get).mockResolvedValue({ data: mockHtml });
    mockCheerioLoad(mockHtml);


    const url = 'https://www.ptt.cc/bbs/Gossiping/M.1633123456.A.123.html';
    const scraper = new PTTScraper();
    const content = await scraper.scrapeArticle(url);

    // Expected content without metadata, push messages, and signature lines.
    const expectedContent = `推 a: 錢\n→ b: 樓下支援\n--`;
    expect(content.trim()).toBe(expectedContent);
  });

  it('should return empty string if main-content not found', async () => {
    const mockHtml = `<html><body><div id="other-content">No PTT content</div></body></html>`;
    vi.mocked(axios.get).mockResolvedValue({ data: mockHtml });
    mockCheerioLoad(mockHtml);

    const url = 'https://www.ptt.cc/bbs/Gossiping/M.1633123456.A.123.html';
    const scraper = new PTTScraper();
    const content = await scraper.scrapeArticle(url);

    expect(content).toBe('');
  });

  it('should throw an error if axios request fails', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('Network error'));
    mockCheerioLoad(''); // Cheerio won't be used if axios fails
    const url = 'https://www.ptt.cc/bbs/Gossiping/M.1633123456.A.123.html';
    const scraper = new PTTScraper();
    await expect(scraper.scrapeArticle(url)).rejects.toThrow('Network error');
  });
});
