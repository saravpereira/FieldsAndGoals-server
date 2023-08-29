const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeEspn(req, res) {
  try {
    console.log("Request received for /scrape-espn");
    const response = await axios.get("https://www.espn.com");
    const $ = cheerio.load(response.data);

    const headlines = [];

    $('.headlineStack__list li').each((index, element) => {
      const headline = $(element).text().trim();
      headlines.push(headline);
    });

    res.json({ headlines });
  } catch (error) {
    console.error("Error scraping:", error);
    res.status(500).json({ error: "Error scraping data" });
  }
}

module.exports = {
  scrapeEspn
};
