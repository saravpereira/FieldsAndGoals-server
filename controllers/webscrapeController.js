const axios = require("axios");
const cheerio = require("cheerio");
const { scoresURL } = require("./constants");

async function scrapeEspn(req, res) {
  try {
    console.log("Request received");

    const date = "20230827";
    const url = `${scoresURL}/_/date/${date}`;

    // Introduce a random delay between 1 and 5 seconds
    const randomDelay = Math.floor(Math.random() * 4000) + 1000;
    await new Promise(resolve => setTimeout(resolve, randomDelay));

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const matchData = [];

    $(".Scoreboard__RowContainer").each((index, container) => {
      const matchInfo = {};

      matchInfo.league = $(container).closest(".Card").find(".Card__Header__Title").text().trim();
      matchInfo.homeTeam = $(container).find(".ScoreboardScoreCell__Item--home .ScoreCell__TeamName").text().trim();
      matchInfo.awayTeam = $(container).find(".ScoreboardScoreCell__Item--away .ScoreCell__TeamName").text().trim();
      matchInfo.homeScore = $(container).find(".ScoreboardScoreCell__Item--home .ScoreCell__Score").text().trim();
      matchInfo.awayScore = $(container).find(".ScoreboardScoreCell__Item--away .ScoreCell__Score").text().trim();
      matchInfo.matchStatus = $(container).find(".ScoreCell__Time").text().trim();

      //matchInfo.homeLogo = $(container).find(".ScoreboardScoreCell__Item--home .ScoreboardScoreCell__Logo").attr("src");
      //matchInfo.awayLogo = $(container).find(".ScoreboardScoreCell__Item--away .ScoreboardScoreCell__Logo").attr("src");

      matchData.push(matchInfo);
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
