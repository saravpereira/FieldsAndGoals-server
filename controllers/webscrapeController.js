const axios = require("axios");
const puppeteer = require("puppeteer");
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
          'User-Agent': 'Mozilla/5.0 (compatible; MSIE 7.0; Windows; U; Windows NT 10.0; x64 Trident/4.0)'
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

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set a user agent for the page
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 7_4_0; like Mac OS X) AppleWebKit/534.49 (KHTML, like Gecko)  Chrome/53.0.1780.199 Mobile Safari/533.3');

    await page.goto(url);
    await page.waitForSelector(".Scoreboard__RowContainer");

    const matchData = await page.evaluate(() => {
      const matchData = [];
      const date = "20230827";

      const matchElements = document.querySelectorAll(".Scoreboard__RowContainer");

      matchElements.forEach((container) => {
        const matchInfo = {};
    
        matchInfo.matchDate = date;
    
        const leagueElement = container.closest(".Card")?.querySelector(".Card__Header__Title");
        matchInfo.league = leagueElement ? leagueElement.textContent.trim() : '';
    
        const homeTeamElement = container.querySelector(".ScoreboardScoreCell__Item--home .ScoreCell__TeamName");
        matchInfo.homeTeam = homeTeamElement ? homeTeamElement.textContent.trim() : '';
    
        const awayTeamElement = container.querySelector(".ScoreboardScoreCell__Item--away .ScoreCell__TeamName");
        matchInfo.awayTeam = awayTeamElement ? awayTeamElement.textContent.trim() : '';
    
        const homeScoreElement = container.querySelector(".ScoreboardScoreCell__Item--home .ScoreCell__Score");
        matchInfo.homeScore = homeScoreElement ? homeScoreElement.textContent.trim() : '';
    
        const awayScoreElement = container.querySelector(".ScoreboardScoreCell__Item--away .ScoreCell__Score");
        matchInfo.awayScore = awayScoreElement ? awayScoreElement.textContent.trim() : '';
    
        const matchStatusElement = container.querySelector(".ScoreCell__Time");
        matchInfo.matchStatus = matchStatusElement ? matchStatusElement.textContent.trim() : '';
    
        const homeLogoElement = container.querySelector(".ScoreboardScoreCell__Item--home .ScoreboardScoreCell__Logo");
        matchInfo.homeLogo = homeLogoElement ? homeLogoElement.getAttribute("src") : '';
    
        const awayLogoElement = container.querySelector(".ScoreboardScoreCell__Item--away .ScoreboardScoreCell__Logo");
        matchInfo.awayLogo = awayLogoElement ? awayLogoElement.getAttribute("src") : '';
    
        matchData.push(matchInfo);
    });

      return matchData;
    });

    await browser.close();

    res.json({ matches: matchData });
  } catch (error) {
    console.error("Error scraping:", error);
    res.status(500).json({ error: "Error scraping data" });
  }
}

module.exports = {
  scrapeEspn
};