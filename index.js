const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const scrapeController = require("./controllers/webscrapeController");

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

app.use("/api/todo", todoRoutes);

app.get("/", scrapeController.scrapeEspn);

app.listen(8080, () => {
  console.log("listening on port 8080");
});
