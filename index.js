const bodyParser = require("body-parser");
const express = require("express");
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

app.use("/api/todos", todoRoutes);

app.listen(8080, () => {
  console.log("listening on port 8080");
});
