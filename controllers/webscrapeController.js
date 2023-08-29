const axios = require("axios");
const cheerio = require("cheerio");
const { headlineUrl } = require("./constants");
const { scoresUrl } = require("./constants");

async function scrapeEspn(req, res) {
  try {
    console.log("Request received");
    const response = await axios.get(headlineUrl);
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
