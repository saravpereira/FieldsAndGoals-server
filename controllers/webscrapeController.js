const puppeteer = require("puppeteer");
const { scoresURL } = require("./constants");

const scrapeEspn = async (startDate, endDate, req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 7_4_0; like Mac OS X) AppleWebKit/534.49 (KHTML, like Gecko)  Chrome/53.0.1780.199 Mobile Safari/533.3');
    const allMatchData = [];

    for (let currentDate = startDate; currentDate <= endDate; currentDate++) {
      await page.goto(`${scoresURL}/_/date/${currentDate}`);
      await page.waitForSelector(".Scoreboard__RowContainer", { timeout: 120000 });

      const matchData = await page.evaluate(date => {
        date = date.toString();
        return [...document.querySelectorAll(".Scoreboard__RowContainer")].map(container => {
          const getText = selector => container.querySelector(selector)?.textContent.trim() || '';
          const getAttr = (selector, attr) => container.querySelector(selector)?.getAttribute(attr) || '';
          const dateObj = new Date(parseInt(date.substring(0, 4)), parseInt(date.substring(4, 6)) - 1, parseInt(date.substring(6, 8)));
          return {
            matchDate: dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            league: getText(".Card__Header__Title"),
            homeTeam: getText(".ScoreboardScoreCell__Item--home .ScoreCell__TeamName"),
            awayTeam: getText(".ScoreboardScoreCell__Item--away .ScoreCell__TeamName"),
            homeScore: getText(".ScoreboardScoreCell__Item--home .ScoreCell__Score") || ' ',
            awayScore: getText(".ScoreboardScoreCell__Item--away .ScoreCell__Score") || ' ',
            matchStatus: getText(".ScoreCell__Time"),
            homeLogo: getAttr(".ScoreboardScoreCell__Item--home .ScoreboardScoreCell__Logo", "src") || 'https://www.seekpng.com/png/full/28-289657_espn-soccer-team-logo-default.png',
            awayLogo: getAttr(".ScoreboardScoreCell__Item--away .ScoreboardScoreCell__Logo", "src") || 'https://www.seekpng.com/png/full/28-28957_espn-soccer-team-logo-default.png'
          };
        });
      }, currentDate.toString());;

      allMatchData.push(...matchData);
    }

    await browser.close();
    res.json({ matches: allMatchData });
  } catch (error) {
    console.error("Error scraping:", error);
    res.status(500).json({ error: "Error scraping data" });
  }
};

module.exports = { scrapeEspn };