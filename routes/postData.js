const Todo = require('../models/match');

async function postData(allMatchData) {
  try {
    const newTodo = new Todo({
      matches: allMatchData
    });

    const savedTodo = await newTodo.save();

    if (savedTodo) {
      console.log('Data saved to database:', savedTodo);
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