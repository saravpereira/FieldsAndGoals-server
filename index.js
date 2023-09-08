const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const matchRoutes = require('./routes/match');

async function main() {
  await mongoose.connect(process.env.DB);
}

main()
  .then((res) => console.log(res))
  .catch((err) => console.log(err));

const app = express();

app.use('/espn', matchRoutes);

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});