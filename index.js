const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const scrapeController = require("./controllers/webscrapeController");
const { getDateRange } = require("./utils/dateUtils");
const matchRoutes = require('./routes/match');


async function main() {
  await mongoose.connect(process.env.DB);
}

main()
  .then((res) => console.log(res))
  .catch((err) => console.log(err));

const app = express();
app.use(express.json());

app.use('/espn', matchRoutes);

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});