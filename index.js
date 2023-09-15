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

/*cron.schedule('0 23 * * *', async () => {
  console.log('Cron job started at:', new Date());
  try {
    await matchController.getPastResults();
    console.log('Cron job completed successfully at:', new Date());
  } catch (error) {
    console.log('Cron job failed with error:', error);
  }
});*/

app.listen(process.env.PORT || 8080, () => {
  console.log("Server listening on port 8080");
});