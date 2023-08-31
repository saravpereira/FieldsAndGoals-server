const axios = require("axios");
const cheerio = require("cheerio");
const { scoresURL } = require("./constants");

const MIN_DELAY = 1000;
const MAX_DELAY = 5000;
const MAX_CONCURRENT_REQUESTS = 5;

let lastRequestTimestamp = 0;
let requestQueue = [];

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processRequestQueue() {
  while (requestQueue.length > 0) {
    const { url, resolve } = requestQueue.shift();
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTimestamp;
    const delayTime = Math.max(MIN_DELAY, Math.min(MAX_DELAY, MAX_DELAY - timeSinceLastRequest));

    if (timeSinceLastRequest < MAX_DELAY && requestQueue.length >= MAX_CONCURRENT_REQUESTS) {
      await delay(delayTime);
    }

    lastRequestTimestamp = Date.now();
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_4_0; like Mac OS X) AppleWebKit/534.49 (KHTML, like Gecko)  Chrome/53.0.1780.199 Mobile Safari/533.3'
        }
      });

      resolve(response);
    } catch (error) {
      console.error("Error making request:", error);
      resolve(null);
    }
  }
}

async function scrapeEspn(req, res) {
  try {
    console.log("Request received");

    const date = "20230827";
    const url = `${scoresURL}/_/date/${date}`;

    const requestPromise = new Promise(resolve => {
      requestQueue.push({ url, resolve });
    });

    await processRequestQueue();

    const response = await requestPromise;

    if (response === null) {
      res.status(500).json({ error: "Error scraping data" });
      return;
    }

    const html = response.data;
    const $ = cheerio.load(html);

    const matchData = [];
    
    $(".Scoreboard__RowContainer").each((index, container) => {
      const matchInfo = {};

      const matchDateArray = date.match(/(\d{4})(\d{2})(\d{2})/);
      const formattedMatchDate = `${matchDateArray[1]}-${matchDateArray[2]}-${matchDateArray[3]}`;
      matchInfo.matchDate = formattedMatchDate;

      matchInfo.league = $(container).closest(".Card").find(".Card__Header__Title").text().trim();
      matchInfo.homeTeam = $(container).find(".ScoreboardScoreCell__Item--home .ScoreCell__TeamName").text().trim();
      matchInfo.awayTeam = $(container).find(".ScoreboardScoreCell__Item--away .ScoreCell__TeamName").text().trim();
      matchInfo.homeScore = $(container).find(".ScoreboardScoreCell__Item--home .ScoreCell__Score").text().trim();
      matchInfo.awayScore = $(container).find(".ScoreboardScoreCell__Item--away .ScoreCell__Score").text().trim();
      matchInfo.matchStatus = $(container).find(".ScoreCell__Time").text().trim(); 

      matchInfo.homeLogo = $(container).find(".ScoreboardScoreCell__Item--home .ScoreboardScoreCell__Logo").attr("src");
      matchInfo.awayLogo = $(container).find(".ScoreboardScoreCell__Item--away .ScoreboardScoreCell__Logo").attr("src");

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
