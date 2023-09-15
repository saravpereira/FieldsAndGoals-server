const mongoose = require("mongoose");
const matchController = require('./match');
require("dotenv").config();

async function runScheduledJob() {
  console.log('Job started at:', new Date());
  try {
    await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Successfully connected to the database');

    await matchController.getPastResults();

    console.log('Job completed successfully at:', new Date());

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.log('Job failed with error:', error);
  }
}

runScheduledJob();