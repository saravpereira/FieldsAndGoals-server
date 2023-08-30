const axios = require("axios");
const cheerio = require("cheerio");
const { scoresURL } = require("./constants");

async function scrapeEspn(req, res) {
  try {
    console.log("Request received");

    const date = "20230827";
    const url = `${scoresURL}/_/date/${date}`;

    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const matchData = [];

    $(".Card.gameModules").each((index, element) => {
      const matchText = $(element).text().trim();
      matchData.push(matchText);
    });

    res.json({ matches: matchData });

  } catch (error) {
    console.error("Error scraping:", error);
    res.status(500).json({ error: "Error scraping data" });
  }
}

module.exports = {
  scrapeEspn
};
