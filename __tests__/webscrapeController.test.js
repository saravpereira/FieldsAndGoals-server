const { scrapeEspn } = require('../controllers/webscrapeController');

describe('Web Scrape Controller', () => {
  test('scrapeEspn should return match data', async () => {
    const startDate = '20231005';
    const endDate = '20231006';
    const result = await scrapeEspn(startDate, endDate);
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  }, 60000);
});
