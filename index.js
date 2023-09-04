const express = require("express");
require("dotenv").config();
const scrapeController = require("./controllers/webscrapeController");
const { getDateRange } = require("./models/dates");

const { startDate, endDate } = getDateRange();
const mongoose = require("mongoose");

async function main() {
  try {
    await mongoose.connect(process.env.DB);
    console.log("Connected to the database");
    
    const app = express();

    app.use("/api/todo", require("./routes/todo.js"));

    app.get("/getDataByDates", (req, res) => {
      scrapeController.scrapeEspn(startDate, endDate, req, res);
    });

    app.listen(8080, () => {
      console.log("Server listening on port 8080");
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

main();
