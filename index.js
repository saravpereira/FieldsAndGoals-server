const express = require("express");
require("dotenv").config();
const scrapeController = require("./controllers/webscrapeController");
const { getDateRange } = require("./models/dates");
const mongoose = require("mongoose");

//If no parameters are provided, by default, startDate is today and endDate is 7 days from today
//If only one parameter is provided, getDateRange() by default sets that parameter as startDate and endDate 7 days from startDate
const { startDate, endDate } = getDateRange("20230901", "20230905");

async function main() {
  await mongoose.connect(process.env.DB);
  console.log("Connected to the database");
  
  const app = express();

  app.use("/api/todo", require("./routes/todo.js"));

  app.get("/espn/getGamesByDates", (req, res) => {
    scrapeController.scrapeEspn(startDate, endDate, req, res);
  });

  app.listen(8080, () => {
    console.log("Server listening on port 8080");
  });
}

main();