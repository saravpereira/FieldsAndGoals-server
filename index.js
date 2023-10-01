const express = require("express");
const mongoose = require("mongoose");
const cron = require("node-cron");
require("dotenv").config();

const matchRoutes = require("./routes/match");
const matchController = require("./controllers/match");

async function main() {
  await mongoose.connect(process.env.DATABASE_URL);
}

main()
  .then((res) => console.log(res))
  .catch((err) => console.log(err));

const app = express();

app.use("/espn", matchRoutes);

// cron.schedule('0 0 * * *', async () => { //Execute at 00:00 daily
//   console.log('Cron job started at:', new Date());
//   try {
//     await matchController.getPastResults();
//     console.log('Cron job completed successfully at:', new Date());
//   } catch (error) {
//     console.log('Cron job failed with error:', error);
//   }
// });

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port test ${process.env.PORT}`);
});
