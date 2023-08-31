const cron = require("node-cron");
const { scheduleCall } = require("./webscrapeController.js");

cron.schedule("0 2 * * *", async () => {
  try {
    console.log("Scheduled task started");
    await scheduleCall();
    console.log("Scheduled task completed");
  } catch (error) {
    console.error("Scheduled task error:", error);
  }
});
