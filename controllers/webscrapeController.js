const puppeteer = require("puppeteer");
const { scoresURL } = require("./constants");

async function scrapeEspn(req, res) {
  try {
    console.log("Request received");

    const date = "20230827";
    const url = `${scoresURL}/_/date/${date}`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

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