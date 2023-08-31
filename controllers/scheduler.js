const cron = require("node-cron");
const { scheduleCall } = require("./webscrapeController.js");
const fs = require("fs");

cron.schedule("0 2 * * *", async () => {
  try {
    const logMessage = `Scheduled task started at ${new Date()}\n`;
    fs.appendFileSync("scheduler_log.txt", logMessage);

    console.log("Scheduled task started");
    await scheduleCall();
    console.log("Scheduled task completed");

    const completionLogMessage = `Scheduled task completed at ${new Date()}\n`;
    fs.appendFileSync("scheduler_log.txt", completionLogMessage);
  } catch (error) {
    console.error("Scheduled task error:", error);
  }
});
