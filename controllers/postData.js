const Match = require('../models/match');

async function postData(allMatchData) {
  try {
    const newMatch = new Match({
      matches: allMatchData
    });

    const savedMatch = await newMatch.save();

    if (savedMatch) {
      console.log('Data saved to database:', savedMatch);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error saving data to database:', error);
    return false;
  }
}

module.exports = {
  postData
};