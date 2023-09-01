const cron = require("node-cron");
const { scrapeEspn } = require("../../controllers/webscrapeController.js");
const fs = require("fs");
const express = require("express");;

const app = express();

cron.schedule("*/5 * * * *", async () => {
  try {
    const logMessage = `Scheduled task started at ${new Date()}\n`;
    fs.appendFileSync("./scheduler_log.txt", logMessage);

    console.log("Scheduled task started");
    console.log("Scheduled task completed");

    const completionLogMessage = `Scheduled task completed at ${new Date()}\n`;
    fs.appendFileSync("./scheduler_log.txt", completionLogMessage);
  } catch (error) {
    console.error("Scheduled task error:", error);
  }
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});