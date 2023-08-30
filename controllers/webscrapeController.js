const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const { sofascoreURL } = require("./constants");

async function scrapeEspn(req, res) {
  try {
    console.log("Request received");
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(sofascoreURL);

    await page.waitForSelector(".sc-fqkvVR.sc-dcJsrY.ditMfZ.hNspbb.sc-2cf4ebd1-0.cLVSQH.js-list-cell-target.js-list-cell-target-11542832");

    const matches = await page.evaluate(() => {
      const matchElements = document.querySelectorAll(".sc-fqkvVR.sc-dcJsrY.ditMfZ.hNspbb.sc-2cf4ebd1-0.cLVSQH.js-list-cell-target.js-list-cell-target-11542832");
      const matchData = [];

      matchElements.forEach((element) => {
        const matchText = element.innerText.trim();
        matchData.push(matchText);
      });

      return matchData;
    });

    await browser.close();

    res.json({ matches });
  } catch (error) {
    console.error("Error scraping:", error);
    res.status(500).json({ error: "Error scraping data" });
  }
}

module.exports = {
  scrapeEspn
};
