const axios = require('axios');

const API_URL = 'http://localhost:3001/api/proofread';
const PTT_URL = 'https://www.ptt.cc/bbs/NBA/M.1732614119.A.706.html';

async function run() {
  try {
    console.log('1. Translating...');
    const translateRes = await axios.post(`${API_URL}/translate`, { url: PTT_URL });
    const data = translateRes.data;
    console.log('Translation complete.', data.articleTitle);

    // Extract Article ID logic from frontend (or just hardcode what we expect)
    const match = PTT_URL.match(/M\.\d+\.A\.[A-Z0-9]+/);
    const articleId = match ? match[0].replace(/\./g, '') : undefined;

    console.log('2. Analyzing (Saving to DB)...');
    await axios.post(`${API_URL}/analyze`, {
      englishSource: data.originalContent,
      googleTranslation: data.translatedContent,
      opTranslation: data.opTranslation,
      articleTitle: data.articleTitle,
      articleId: articleId
    });
    console.log('Analysis saved to DB for Article ID:', articleId);
  } catch (err) {
    console.error('Error:', err.message);
    if(err.response) console.error(err.response.data);
  }
}

run();
