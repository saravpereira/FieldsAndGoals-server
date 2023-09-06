const { join } = require("path");

/**
 * @type {import("puppeteer").Configuration}
 */

module.exports = {
    //Pupeteer is used because Cheerio had problems scraping links and body texts
    cacheDirectory: join(__dirname, ".cache", "puppeteer"),
};