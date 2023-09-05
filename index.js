const express = require("express");
require("dotenv").config();
const scrapeController = require("./controllers/webscrapeController");
const { getDateRange } = require("./models/dates");
const mongoose = require("mongoose");

mongoose.connect(process.env.DB);
console.log("Connected to the database");

const app = express();

app.use("/api/todo", require("./routes/todo.js"));

app.get("/espn/getGamesByDates", (req, res) => {
  /**
   * User can specify startDate and endDate by appending them as query parameters:
   * http://localhost:8080/espn/getGamesByDates?startDate=20230901&endDate=20230905
   */
  const userStartDate = req.query.startDate;
  const userEndDate = req.query.endDate;

  const { startDate, endDate } = getDateRange(userStartDate, userEndDate);

  scrapeController.scrapeEspn(startDate, endDate, req, res);
});

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});