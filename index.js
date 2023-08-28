const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();

const app = express();
const mongoose = require("mongoose");
const todoRoutes = require("./routes/todo.js");

main()
  .then((res) => console.log(res))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/api/todo", todoRoutes);

// Web scraping endpoint
app.get("/scrape-espn", async (req, res) => {
  try {
    console.log("Request received for /scrape-espn");
    const response = await axios.get("https://www.espn.com");
    const $ = cheerio.load(response.data);

    const headlines = [];

    $('.headlineStack__list li').each((index, element) => {
      const headline = $(element).text().trim();
      headlines.push(headline);
    });

    res.json({ headlines });
  } catch (error) {
    console.error("Error scraping:", error);
    res.status(500).json({ error: "Error scraping data" });
  }
});

app.listen(8080, () => {
  console.log("listening on port 8080");
});
